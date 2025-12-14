using System.Text.Json;
using Microsoft.Extensions.Options;
using News.DTOs;
using News.Settings;

namespace News.Services
{
    public class NewsApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly NewsApiSettings _settings;
        
        public NewsApiClient(HttpClient httpClient, IOptions<NewsApiSettings> settings)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
        }
        
        public async Task<List<NewsApiResponseDto.NewsArticleDto>> GetNewsAsync()
        {
            var requestUri = $"/v1/news/all?symbols=NVDA%2CAAPL&filter_entities=true&language=en&api_token={_settings.ApiToken}";
            
            var response = await _httpClient.GetAsync(requestUri);
            
            var news = await response.Content.ReadFromJsonAsync<NewsApiResponseDto>(
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                
            return news?.Data ?? new List<NewsApiResponseDto.NewsArticleDto>();

        }
    }
}
