using Microsoft.EntityFrameworkCore;
using News.Clients;
using News.Data;
using News.DTOs;
using News.Models;

namespace News.Services;

public class NewsService
{
    private readonly NewsDbContext _context;
    private readonly NewsApiClient _newsApiClient;

    public NewsService(NewsDbContext context, NewsApiClient newsApiClient)
    {
        _context = context;
        _newsApiClient = newsApiClient;
    }

    /// <summary>
    /// Retrieves news articles for provided ticker symbols.
    /// </summary>
    /// <param name="symbols">A list containing one or more symbols.</param>
    /// <returns>A list of <see cref="NewsArticle"/> objects sorted by latest articles.</returns>
    public async Task<List<NewsArticle>> GetAllNewsBySymbolsAsync(List<string> symbols)
    {
        var fromSixHoursAgo = DateTime.UtcNow.AddHours(-6);

        // Get ALL existing articles for these symbols (fresh AND stale)
        var existingDbArticles = await _context.NewsArticles
            .Include(a => a.NewsArticleEntities)
            .Where(a => a.NewsArticleEntities.Any(e => symbols.Contains(e.Symbol)))
            .OrderByDescending(a => a.PublishedAt)
            .ToListAsync();

        // Identify which symbols from your request actually have "Fresh" news
        var symbolsWithFreshNews = existingDbArticles
            .Where(a => a.PublishedAt > fromSixHoursAgo)
            .SelectMany(a => a.NewsArticleEntities)
            .Where(e => symbols.Contains(e.Symbol)) // Filter to only the requested ones
            .Select(e => e.Symbol)
            .Distinct()
            .ToHashSet();

        // Determine which symbols are MISSING fresh coverage
        var symbolsToFetch = symbols
            .Where(s => !symbolsWithFreshNews.Contains(s))
            .ToList();

        // If all symbols have fresh news, return early
        if (symbolsToFetch.Count == 0)
        {
            return existingDbArticles;
        }

        // Call the API only for the missing symbols 
        var apiNewsArticlesDtos = await _newsApiClient.GetAllNewsBySymbolsAsync(symbolsToFetch);

        // Get UUIDs of the NEWLY fetched items
        var apiUuids = apiNewsArticlesDtos.Select(d => d.Uuid).ToList();

        // Check which of these specific new UUIDs already exist in DB
        // (We only need to check against the new batch, not the whole DB)
        var existingUuidsInDb = await _context.NewsArticles
            .Where(a => apiUuids.Contains(a.Uuid))
            .Select(a => a.Uuid)
            .ToListAsync();

        var existingUuidSet = existingUuidsInDb.ToHashSet();

        // Filter out duplicates
        var newEntities = apiNewsArticlesDtos
            .Where(dto => !existingUuidSet.Contains(dto.Uuid))
            .Select(dto => NewsArticleDtoToEntity(dto))
            .ToList();

        if (newEntities.Count > 0)
        {
            await _context.NewsArticles.AddRangeAsync(newEntities);
            await _context.SaveChangesAsync();

            existingDbArticles.AddRange(newEntities);
        }

        // Return combined list (DB Cache + New API items)
        return existingDbArticles
            .OrderByDescending(a => a.PublishedAt)
            .ToList();
    }
    /// <summary>
    /// Maps a raw API response DTO to a database Entity.
    /// </summary>
    /// <param name="newsArticleDto">Raw news article data object retrieved from the API.</param>
    /// <param name="filterSymbols">List of symbols used to filter which related entities are stored.</param>
    /// <returns>A populated <see cref="NewsArticle"/> ready for database insertion.</returns>
    private static NewsArticle NewsArticleDtoToEntity(NewsApiResponseDto.NewsArticleDto newsArticleDto)
    {
        var newArticle = new NewsArticle
        {
            Uuid = newsArticleDto.Uuid,
            Title = newsArticleDto.Title,
            Description = newsArticleDto.Description,
            Url = newsArticleDto.Url,
            Language = newsArticleDto.Language,
            PublishedAt = newsArticleDto.PublishedAt.ToUniversalTime(), // Ensure UTC
            NewsArticleEntities = newsArticleDto.Entities.Select(e => new NewsArticle.NewsArticleEntity
            {
                Symbol = e.Symbol,
                Name = e.Name,
                Country = e.Country,
                Industry = e.Industry,
            }).ToList()
        };

        return newArticle;
    }
}