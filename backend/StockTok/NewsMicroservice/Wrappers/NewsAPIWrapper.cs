using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using NewsMicroservice.Models;

namespace StockTok.NewsMicroservice.Wrappers
{
    public class NewsAPIWrapper
    {
        [JsonPropertyName("data")]
        public List<NewsModel> Data { get; set; }
    }
}
