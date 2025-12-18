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
        // Calculate the cutoff time to determine if stored news is still considered "fresh" (6-hour cache)
        var fromSixHoursAgo = DateTime.UtcNow.AddHours(-6);

        // Check if there are any news articles by symbol in the database, which are more than 6 hours old (cache time period)
        var existingDbArticles = await _context.NewsArticles
            .Include(a => a.NewsArticleEntities)
            .Where(a => a.NewsArticleEntities.Any(e => symbols.Contains(e.Symbol)))
            .OrderByDescending(a => a.PublishedAt)
            .ToListAsync();

        // If there are no news articles in the database that are more than 6 hours old (cache time period), then simply return the existing news articles in the database
        bool hasRecentNews = existingDbArticles.Any(a => a.PublishedAt > fromSixHoursAgo);

        if (hasRecentNews)
        {
            return existingDbArticles;
        }
        
        // [TODO]: Remove this if we decide not to use the `NewsFilterParams` class
        // var queryParams = new NewsFilterParams
        // {
        //     Symbols = [symbol],
        //     // PublishedAfter = 
        // };

        // Query the Marketaux API
        var apiNewsArticlesDtos = await _newsApiClient.GetAllNewsBySymbolsAsync(symbols);

        // Collect the new news articles by UUID that don't yet exist in the database
        var apiUuids = apiNewsArticlesDtos.Select(d => d.Uuid).ToList();

        var currentUuids = await _context.NewsArticles
            .Where(a => apiUuids.Contains(a.Uuid))
            .Select(a => a.Uuid)
            .ToListAsync();

        var currentUuidSet = currentUuids.ToHashSet();

        // Collect all DTOs that do not currently exist in the DB
        var filteredNewsArticlesDtos = apiNewsArticlesDtos
            .Where(dto => !currentUuidSet.Contains(dto.Uuid))
            .ToList();

        // Save only the new articles
        if (filteredNewsArticlesDtos.Count > 0)
        {
            var newEntities = filteredNewsArticlesDtos
                .Select(dto => NewsArticleDtoToEntity(dto))
                .ToList();

            await _context.NewsArticles.AddRangeAsync(newEntities);
            await _context.SaveChangesAsync();

            // Add to the list to be returned
            existingDbArticles.AddRange(newEntities);
        }
        
        // Re-sort the combined list so the newest API items appear at the top
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