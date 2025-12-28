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
    
    public async Task<List<NewsArticle>> GetAllNewsBySymbolAsync(string symbol)
    {
        // Calculate the cutoff time to determine if stored news is still considered "fresh" (6-hour cache)
        var fromSixHoursAgo = DateTime.UtcNow.AddHours(-6);

        // Check if there are any news articles by symbol in the database, which are more than 6 hours old (cache time period)
        var existingDbArticles = await _context.NewsArticles
            .Include(a => a.NewsArticleEntities)
            .Where(a => a.NewsArticleEntities.Any(e => e.Symbol == symbol))
            .OrderByDescending(a => a.PublishedAt)
            .ToListAsync();

        // If there are no news articles in the database that are more than 6 hours old (cache time period), then simply return the existing news articles in the database
        bool hasRecentNews = existingDbArticles.Any(a => a.PublishedAt >= fromSixHoursAgo);

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
        var apiNewsArticlesDtos = await _newsApiClient.GetAllNewsBySymbolsAsync([symbol]);
        
        // Collect the new news articles that don't yet exist in the database
        var uniqueNewsArticleDtos = apiNewsArticlesDtos
            .ExceptBy(existingDbArticles.Select(a => a.Uuid), dto => dto.Uuid)
            .ToList();
        
        // Convert these new news articles into its DTO
        var newEntities = uniqueNewsArticleDtos
            .Select(NewsArticleDtoToEntity)
            .ToList();
            
        // Save these new news articles into the database
        if (newEntities.Count > 0)
        {
            await _context.NewsArticles.AddRangeAsync(newEntities);
            await _context.SaveChangesAsync();
        
            // Add new items to the existing list in-place to avoid allocating a new return List
            existingDbArticles.AddRange(newEntities);
        }
        
        // Re-sort the combined list so the newest API items appear at the top
        return existingDbArticles
            .OrderByDescending(a => a.PublishedAt)
            .ToList();
    }

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