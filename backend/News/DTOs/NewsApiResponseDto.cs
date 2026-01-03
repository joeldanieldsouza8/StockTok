namespace News.DTOs;

/// <summary>
/// Represents the root response object returned by the Marketaux API.
/// </summary>
public class NewsApiResponseDto
{
    /// <summary>
    /// List of news articles returned by the Marketaux API.
    /// </summary>
    public List<NewsArticleDto> Data { get; set; } = [];

    /// <summary>
    /// A single news article returned from the Marketaux API.
    /// </summary>
    public class NewsArticleDto
    {
        /// <summary>
        /// Unique identifier for the article, as provided by the Marketaux API.
        /// </summary>
        public string Uuid { get; set; } = string.Empty;

        /// <summary>
        /// Headline or title of the news article.
        /// </summary>
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// Summary or description of the news article's content.
        /// </summary>
        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// A short text fragment or highlight from the article.
        /// </summary>
        public string Snippet { get; set; } = string.Empty;

        /// <summary>
        /// Direct URL to the full news article on the source's website.
        /// </summary>
        public string Url { get; set; } = string.Empty;

        /// <summary>
        /// Two-letter language code in which the article is written in.
        /// </summary>
        /// <example>
        /// "en" for English.
        /// </example>
        public string Language { get; set; } = string.Empty;

        /// <summary>
        /// The name of the source or domain that published the article.
        /// </summary>
        /// <example>
        /// "Bloomberg", "TechCrunch".
        /// </example>
        public string Source { get; set; } = string.Empty;

        /// <summary>
        /// URL to the main image associated with the article, if available.
        /// </summary>
        public string ImageUrl { get; set; } = string.Empty;

        /// <summary>
        /// Coordinated Universal Time (UTC) timestamp indicating when the article was published.
        /// </summary>
        public DateTime PublishedAt { get; set; } 

        /// <summary>
        /// List of financial entities (like companies or stocks) associated with the news article.
        /// </summary>
        /// <seealso cref="EntityDto"/>
        public List<EntityDto> Entities { get; set; } = [];
    }

    /// <summary>
    /// A single entity (company, index, etc.) found within a news article.
    /// </summary>
    public class EntityDto
    {
        /// <summary>
        /// Stock ticker symbol for the entity.
        /// </summary>
        /// <example>
        /// NVDA for Nvidia, AAPL for Apple.
        /// </example>
        public string Symbol { get; set; } = string.Empty;

        /// <summary>
        /// The full proper name of the stock ticker (entity).
        /// </summary>
        /// <example>
        /// Nvidia Corporation, Apple Inc.
        /// </example>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// The type of the entity.
        /// </summary>
        /// <example>
        /// "equity", "index".
        /// </example>
        public string Type { get; set; } = string.Empty;

        /// <summary>
        /// Industry category to which the entity belongs.
        /// </summary>
        /// <example>
        /// Technology, Healthcare.
        /// </example>
        public string Industry { get; set; } = string.Empty;

        /// <summary>
        /// Two-letter country code where the entity is based.
        /// </summary>
        /// <example>
        /// "us" for the USA.
        /// </example>
        public string Country { get; set; } = string.Empty;
        
        // public double MatchScore { get; set; }
        // public double SentimentScore { get; set; }
    }
}