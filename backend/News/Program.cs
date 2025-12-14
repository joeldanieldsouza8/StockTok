using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using News.DBContexts;
using News.Services;
using News.Settings;

namespace News;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        ConfigureServices(builder);

        var app = builder.Build();

        ConfigureMiddleware(app);

        app.Run();
    }

    private static void ConfigureServices(WebApplicationBuilder builder)
    {
        var services = builder.Services;
        var configuration = builder.Configuration;
        
        services.AddDbContext<NewsContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("WebApiDatabase")));
        
        // Bind the "NewsApi" section from the 'appsettings.json' to the 'NewsApiSettings' class
        services.AddOptions<NewsApiSettings>()
            .Bind(configuration.GetSection(NewsApiSettings.SectionName))
            .ValidateDataAnnotations() // Ensures required fields are present at startup
            .ValidateOnStart();
        
        // Register the Typed HttpClient with IHttpClientFactory
        services.AddHttpClient<NewsApiClient>((serviceProvider, client) =>
        {
            var settings = serviceProvider.GetRequiredService<IOptions<NewsApiSettings>>().Value;
            client.BaseAddress = new Uri(settings.BaseUrl);
            // client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json")); // TODO: This may be optional if the data returned (i.e., the data will be consumed) is already in JSON format.
        });
        
        // Prevent circular referencing
        services.AddControllers()
            .AddJsonOptions(options =>
             {
                 options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                 options.JsonSerializerOptions.WriteIndented = true;
             });

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
    }

    private static void ConfigureMiddleware(WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        // app.UseHttpsRedirection();

        // The order of these is critical
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
    }
}