using System.Text.Json.Serialization;

namespace NewsMicroservice.Models
{
    public class NewsModel
    {
        [JsonPropertyName("uuid")]
        public string UUID { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("url")]
        public string Url { get; set; }

        [JsonPropertyName("language")]
        public string Language { get; set; }

        [JsonPropertyName("entities")]
        public List<TempEntity>? EntitiesRaw { get; set; }

        // Flattened arrays of all entity data as e.g. symbols is inside nested structure called "data" in JSON
        [JsonIgnore]
        public string[] Symbols => EntitiesRaw?.Select(e => e.Symbol).ToArray() ?? Array.Empty<string>();

        [JsonIgnore]
        public string[] Names => EntitiesRaw?.Select(e => e.Name).ToArray() ?? Array.Empty<string>();

        [JsonIgnore]
        public string[] Countries => EntitiesRaw?.Select(e => e.Country).ToArray() ?? Array.Empty<string>();

        [JsonIgnore]
        public string[] Industries => EntitiesRaw?.Select(e => e.Industry).ToArray() ?? Array.Empty<string>();

        // class is for creating collection using List of objects for each of these entities (to match API response)
        public class TempEntity
        {
            [JsonPropertyName("symbol")]
            public string Symbol { get; set; }

            [JsonPropertyName("name")]
            public string Name { get; set; }

            [JsonPropertyName("country")]
            public string Country { get; set; }

            [JsonPropertyName("industry")]
            public string Industry { get; set; }
        }
    }
}