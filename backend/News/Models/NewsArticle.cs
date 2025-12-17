using System.ComponentModel.DataAnnotations;

namespace News.Models;

/// <summary>
/// Represents a single news article, stored in the database.
/// </summary>
public class NewsArticle
{
    /// <summary>
    /// Unique identifier for the article, as provided by the Marketaux API.
    /// </summary>
    [Key]
    public string Uuid { get; set; } 
    
    /// <summary>
    /// Headline or title of the news article.
    /// </summary>
    public string Title { get; set; }
    
    /// <summary>
    /// Summary or a snippet of the news article's content.
    /// </summary>
    public string Description { get; set; }
    
    /// <summary>
    /// Direct URL to the full news article on the source's website.
    /// </summary>
    public string Url { get; set; }

    /// <summary>
    /// Two-letter language code in which the article is written in.
    /// </summary>
    /// <example>
    /// "en" for English.
    /// </example>
    public string Language { get; set; }
    
    /// <summary>
    /// Coordinated Universal Time (UTC) timestamp indicating when the article was published.
    /// </summary>
    public DateTime PublishedAt { get; set; }

    /// <summary>
    /// Navigation property for the one-to-many relationship
    /// </summary>
    public ICollection<NewsArticleEntity> NewsArticleEntities { get; set; } = new List<NewsArticleEntity>();
    
    public class NewsArticleEntity
    {
        /// <summary>
        /// The unique primary key for this entity.
        /// </summary>
        public Guid ID { get; set; }
    
        /// <summary>
        /// Stock ticker symbol for the entity.
        /// </summary>
        /// <example>
        /// NVDA, AAPL
        /// </example>
        public string Symbol { get; set; }
    
        /// <summary>
        /// Full proper name of the entity.
        /// </summary>
        /// <example>
        /// NVIDIA Corporation
        /// </example>
        public string Name { get; set; }
    
        /// <summary>
        /// Two-letter country code where the entity is based.
        /// </summary>
        /// <example>
        /// us for the USA.
        /// </example>
        public string Country { get; set; }
    
        /// <summary>
        /// Industry category to which the entity belongs.
        /// </summary>
        /// <example>
        /// Technology, Healthcare
        /// </example>
        public string Industry { get; set; }

        /// <summary>
        /// Foreign key property
        /// </summary>
        public string ArticleID { get; set; }

        /// <summary>
        /// Navigation property back to the parent NewsArticle
        /// </summary>
        public NewsArticle NewsArticle { get; set; } = new();
    }
}