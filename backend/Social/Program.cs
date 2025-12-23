
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using Social.Models;

namespace Social

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
        
        services.AddDbContext<NewsDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("PostsDatabase")));
        
        services.AddControllers();
        
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
        // app.UseAuthentication();
        // app.UseAuthorization();

        app.MapControllers();
    }
}
