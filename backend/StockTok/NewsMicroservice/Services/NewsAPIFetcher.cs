using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Runtime;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using NewsMicroservice.Models;
using StockTok.NewsMicroservice.Settings;
using StockTok.NewsMicroservice.Wrappers;

namespace StockTok.NewsMicroservice.Services
{

    public class DataObject
    {
        public string Name { get; set; }
    }
    public class NewsAPIFetcher
    {
        private readonly HttpClient _httpClient;
        private readonly APISettings _settings;

        public NewsAPIFetcher(HttpClient httpClient, IOptions<APISettings> options)
        {
            _httpClient = httpClient;
            _settings = options.Value;


            _httpClient.BaseAddress = new Uri(_settings.BaseUrl);
            _httpClient.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
            _httpClient.DefaultRequestHeaders.Authorization =
               new AuthenticationHeaderValue("Token", _settings.ApiKey);
        }


        public async Task<IEnumerable<NewsModel>> GetAPIResponse()
        {
            var response = await _httpClient.GetAsync($"/v1/news/all?symbols=NVDA%2CAAPL&filter_entities=true&language=en&api_token={_settings.ApiKey}");

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                Console.WriteLine("Raw JSON: ");
                Console.WriteLine(json);

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var result = JsonSerializer.Deserialize<NewsAPIWrapper>(json, options);
                return result?.Data ?? new List<NewsModel>();
            }

            Console.WriteLine($"Error: {response.StatusCode} - {response.ReasonPhrase}");
            return new List<NewsModel>();
        }
    }
}
