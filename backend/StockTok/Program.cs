using System.Threading.Tasks;
using StockTok.NewsMicroservice.Services;
using StockTok.NewsMicroservice.Settings;

namespace StockTok;


public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();


        builder.Services.Configure<APISettings>(
            builder.Configuration.GetSection("News-API")
        );

        builder.Services.AddHttpClient<NewsAPIFetcher>();


        var app = builder.Build();

        app.UseRouting();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });

        // this will display on backend URL
        app.MapGet("/", () => "Hello World!");

        var fetcher = app.Services.GetRequiredService<NewsAPIFetcher>();
        var result = await fetcher.GetAPIResponse();


        // API call output will be shown in console
        Console.WriteLine("\n\n");

        foreach (var item in result)
        {
            Console.WriteLine($"Title: {item.Title}\nDescription: {item.Description}\nTickers: {string.Join(", ", item.Symbols)}");
            Console.WriteLine("\n");
        }

        app.Run();
    }
}