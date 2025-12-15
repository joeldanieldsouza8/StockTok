namespace News.DTOs;

public class NewsFilterParams
{
    public List<string> Symbols { get; set; } = [];
    public string[]? EntityTypes { get; set; }
    public string[]? Industries { get; set; }
    public string[]? Countries { get; set; }
    public string? Search { get; set; }
    public double? MinMatchScore { get; set; }
    public double? SentimentGte { get; set; }
    public double? SentimentLte { get; set; }
    public bool? FilterEntities { get; set; }
    public bool? MustHaveEntities { get; set; }
    public bool? GroupSimilar { get; set; }
    public string[]? Domains { get; set; }
    public string[]? ExcludeDomains { get; set; }
    public string[]? SourceIds { get; set; }
    public string[]? ExcludeSourceIds { get; set; }
    public string[]? Languages { get; set; } = ["en"];
    public DateTime? PublishedBefore { get; set; }
    public DateTime? PublishedAfter { get; set; }
    public DateTime? PublishedOn { get; set; }
    public string? Sort { get; set; }
    public string? SortOrder { get; set; }
    public int Limit { get; set; } = 10;
    public int Page { get; set; } = 1;
}