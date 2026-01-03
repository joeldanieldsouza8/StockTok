using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using News.Clients;
using News.Data;
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

        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            try
            {
                var context = services.GetRequiredService<NewsDbContext>();

                context.Database.Migrate();

                Console.WriteLine("Database migrations applied successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while migrating the database: {ex.Message}");
            }
        }

        ConfigureMiddleware(app);

        app.Run();
    }

    private static void ConfigureServices(WebApplicationBuilder builder)
    {
        var services = builder.Services;
        var configuration = builder.Configuration;

        services.AddDbContext<NewsDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("NewsDatabase")));

        builder.Services.AddOptions<NewsApiSettings>()
            .BindConfiguration("NewsApiSettings")
            .ValidateDataAnnotations()
            .ValidateOnStart();

        // Register the Typed HttpClient with IHttpClientFactory
        services.AddHttpClient<NewsApiClient>((serviceProvider, client) =>
        {
            var settings = serviceProvider.GetRequiredService<IOptions<NewsApiSettings>>().Value;
            client.BaseAddress = new Uri(settings.BaseUrl);
        });

        services.AddScoped<NewsService>();

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

        // app.UseHttpsRedirection(); // Keep commented out for internal Docker services

        // The order of these is critical
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
    }
}