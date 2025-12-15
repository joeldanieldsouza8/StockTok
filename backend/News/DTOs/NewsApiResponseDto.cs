namespace News.DTOs;

public class NewsApiResponseDto
{
    public MetaDto Meta { get; set; } 
    public List<NewsArticleDto> Data { get; set; } = [];

    public class MetaDto
    {
        public int Found { get; set; }
        public int Returned { get; set; }
        public int Limit { get; set; }
        public int Page { get; set; }
    }

    public class NewsArticleDto
    {
        public string Uuid { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Snippet { get; set; } = string.Empty;
        public string Url { get; set; }
        public string Language { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime PublishedAt { get; set; } 
        public List<EntityDto> Entities { get; set; } = [];
    }

    public class EntityDto
    {
        public string Symbol { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public double MatchScore { get; set; }
        public double SentimentScore { get; set; }
    }
}