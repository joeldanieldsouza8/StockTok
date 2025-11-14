namespace News.DTOs;

public class NewsApiResponseDto
{
    /// <summary>
    /// List of news articles returned by the Marketaux API.
    /// </summary>
    public List<NewsArticleDto> Data { get; set; } = new();
    
    /// <summary>
    /// A single news article returned from the Marketaux API.
    /// </summary>
    public class NewsArticleDto
    {
        /// <summary>
        /// Unique identifier for the article, as provided by the Marketaux API.
        /// </summary>
        public string Uuid { get; set; }

        /// <summary>
        /// Headline or title of the news article.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Summary or snippet of the news article's content.
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
        public DateTime Published_At { get; set; }

        /// <summary>
        /// List of financial entities (like companies or stocks) associated with the news article.
        /// </summary>
        /// <seealso cref="NewsArticleEntityDto"/>
        public List<NewsArticleEntityDto> Entities { get; set; } = [];
    }
    
    /// <summary>
    /// A single entity within a given news's article.
    /// </summary>
    public class NewsArticleEntityDto
    {
        /// <summary>
        /// stock ticker symbol for the entity.
        /// </summary>
        /// <example>
        /// NVDA for Nvidia, AAPL for Apple
        /// </example>
        public string Symbol { get; set; }

        /// <summary>
        /// The full proper name of the stock ticker (entity)
        /// </summary>
        /// <example>
        /// Nvidia Corporation, Apple
        /// </example>
        public string Name { get; set; }

        /// <summary>
        /// Two-letter country code where the entity is based
        /// </summary>
        /// <example>
        /// us for the USA.
        /// </example>
        public string Country { get; set; }

        /// <summary>
        /// Industry category to which the entity belongs.
        /// </summary>
        /// <example>
        /// Technology, Healthcare.
        /// </example>
        public string Industry { get; set; }
    }
}