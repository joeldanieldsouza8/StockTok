using System.ComponentModel.DataAnnotations;

namespace News.Settings;

/// <summary>
/// Provides strongly-typed access to the configuration settings required for the Marketaux News API.
/// </summary>
public class NewsApiSettings
{
    public const string SectionName = "NewsApi";

    /// <summary>
    /// Base URL for the Marketaux News API.
    /// </summary>
    [Required]
    public string BaseUrl { get; set; } = string.Empty;

    /// <summary>
    /// PI token used to authenticate with the News API.
    /// </summary>
    [Required]
    public string ApiToken { get; set; } = string.Empty;
}