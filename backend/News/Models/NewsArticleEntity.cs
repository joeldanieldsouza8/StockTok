namespace News.Models;

/// <summary>
/// Represents a financial entity (e.g., a company) associated with a news article, stored in the database.
/// </summary>
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