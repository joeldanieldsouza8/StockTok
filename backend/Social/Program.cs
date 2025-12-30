using Microsoft.EntityFrameworkCore;
using Posts.Data;
using Posts.Hubs;
using Posts.Services;
using Social.Data;

namespace Social;

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

        services.AddDbContext<PostDBContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("SocialDB")));

        services.AddScoped<PostsService>();
        services.AddScoped<CommentsService>();

        services.AddSignalR();

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
        // app.UseAuthentication();
        // app.UseAuthorization();

        app.MapControllers();

        app.MapHub<CommentHub>("/hubs/comments");
    }
}