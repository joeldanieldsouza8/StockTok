using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using News.Clients;
using News.DBContexts;
using News.Models;

namespace News.Controllers
{   
    /// <summary>
    /// The News API Controller for handling news articles.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        // Dependency injection
        private readonly NewsApiClient _newsApiClient;
        private readonly NewsContext _context;

        /// <summary>
        /// News constructor.
        /// </summary>
        /// <param name="newsApiClient">Service communicating with Marketaux API</param>
        /// <param name="context">Database context for accessing PostgreSQL</param>
        public NewsController(NewsApiClient newsApiClient, NewsContext context)
        {
            _newsApiClient = newsApiClient;
            _context = context;
        }

        /// <summary>
        /// GET /api/news
        /// Fetches news directly from Marketaux API without saving to database.
        /// </summary>
        /// <returns>List of news articles from the API as DTOs</returns>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            // Calling the API to get the news data
            var data = await _newsApiClient.GetNewsAsync();
            return Ok(data);
        }

        /// <summary>
        /// POST /api/news/fetch-and-save
        /// Fetches news from Marketaux API and saves it to PostgreSQL database
        /// </summary>
        /// <returns>Success message with count of saved articles and entities</returns>
        [HttpPost("fetch-and-save")]
        public async Task<IActionResult> FetchAndSave()
        {
            try
            {
                // Checking database connection
                if (!await _context.Database.CanConnectAsync())
                {
                    return StatusCode(503, new
                    {
                        success = false,
                        message = "Database connection unavailable",
                        error = "Unable to connect to PostgreSQL database"
                    });
                }

                // Fetch data from Marketaux API
                var APIData = await _newsApiClient.GetNewsAsync();

                // Validate presence of data
                if (APIData == null || !APIData.Any())
                {
                    return BadRequest("No data received from API");
                }

                // Instantiate a list containing the database models
                var articles = new List<NewsArticle>();

                // Transform each DTO into database model
                foreach (var article in APIData)
                {
                    // Create new database model object
                    var newArticle = new NewsArticle
                    {
                        // Mapping props from DTO to database model
                        Uuid = article.Uuid,
                        Title = article.Title,
                        Description = article.Description,
                        Url = article.Url,
                        Language = article.Language,
                        PublishedAt = article.Published_At,

                        NewsArticleEntities = new List<NewsArticleEntity>()
                    };

                    // Process any associated entities
                    if (article.Entities != null && article.Entities.Any())
                    {
                        foreach (var entity in article.Entities)
                        {
                            // Create new database model object for each entity
                            newArticle.NewsArticleEntities.Add(new NewsArticleEntity
                            {
                                ID = Guid.NewGuid(),
                                Symbol = entity.Symbol,
                                Name = entity.Name,
                                Country = entity.Country,
                                Industry = entity.Industry
                            });
                        }
                    }

                    // Add new article with all its entities to the list
                    articles.Add(newArticle);
                }

                // Save all articles to database
                await _context.NewsArticles.AddRangeAsync(articles); // Prepare for bulk insert
                await _context.SaveChangesAsync(); // Write to PostgreSQL

                // Return counts of fetched data
                return Ok(new
                {
                    success = true,
                    message = $"Successfully saved {articles.Count} articles",
                    articlesCount = articles.Count,
                    entitiesCount = articles.Sum(a => a.NewsArticleEntities.Count)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error saving data",
                    error = ex.Message,
                    innerError = ex.InnerException?.Message

                });
            }
        }

        /// <summary>
        /// GET /api/news/from-database
        /// Retrieves all news articles from database
        /// </summary>
        /// <returns>All articles with their associated entities</returns>
        [HttpGet("from-database")]
        public async Task<IActionResult> GetFromDatabase()
        {
            try
            {
                // "Eager loading" of all articles from the database in same query
                var articles = await _context.NewsArticles
                    .Include(a => a.NewsArticleEntities)
                    .ToListAsync();

                // Return the metadata
                return Ok(new
                {
                    success = true,
                    count = articles.Count,
                    data = articles
                });
            }
            catch (Exception ex)
            {
                // Handle errors
                return StatusCode(500, new
                {
                    success = false,
                    error = ex.Message
                });
            }
        }
    }
}