using System.Text.Json;
using Microsoft.Extensions.Options;
using News.DTOs;
using News.Settings;

namespace News.Clients;

public class NewsApiClient
{
    private readonly HttpClient _httpClient;
    private readonly NewsApiSettings _settings;
        
    public NewsApiClient(HttpClient httpClient, IOptions<NewsApiSettings> settings)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
    }
        
    public async Task<List<NewsApiResponseDto.NewsArticleDto>> GetAllNewsBySymbolsAsync(List<string> symbols)
    {
        // var requestUri = $"/v1/news/all?symbols=NVDA%2CAAPL&filter_entities=true&language=en&api_token={_settings.ApiToken}";
        
        var tickers = string.Join(",", symbols);
        
        var requestUri = $"/v1/news/all?symbols={tickers}&filter_entities=false&language=en&api_token={_settings.ApiToken}";
            
        var response = await _httpClient.GetAsync(requestUri);

        var options = new JsonSerializerOptions()
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        };
        
        var news = await response.Content.ReadFromJsonAsync<NewsApiResponseDto>(options);
                
        return news?.Data ?? new List<NewsApiResponseDto.NewsArticleDto>();
    }
}