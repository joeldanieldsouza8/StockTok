using User.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;  // For JwtBearerDefaults
using Microsoft.EntityFrameworkCore;  // For DbContext
using Microsoft.IdentityModel.Tokens;  // Add for TokenValidationParameters
using System.Security.Claims;  // Add for ClaimTypes
using DotNetEnv;  // For loading .env files

using User.Services;

namespace User;

public class Program
{
    public static async Task Main(string[] args)
    {
        // Load environment variables from .env file
        Env.Load();
        
        var builder = WebApplication.CreateBuilder(args);
        
        ConfigureServices(builder);
        
        var app = builder.Build();
        
        // Apply migrations and seed data in development
        if (app.Environment.IsDevelopment())
        {
            using var scope = app.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<UserDbContext>();
            
            Console.WriteLine("Applying database migrations...");
            await context.Database.MigrateAsync();
            Console.WriteLine("Migrations applied successfully.");
            
        }
        
        
        ConfigureMiddleware(app);
        
        app.Run();
    }

    private static void ConfigureServices(WebApplicationBuilder builder)
    {
        var services = builder.Services;
        var configuration = builder.Configuration;
        
        // Build connection string from environment variables
        var dbHost = Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost";
        var dbPort = Environment.GetEnvironmentVariable("DB_PORT") ?? "5432";
        var dbName = Environment.GetEnvironmentVariable("DB_NAME") ?? "userdb";
        var dbUsername = Environment.GetEnvironmentVariable("DB_USERNAME") ?? "postgres";
        var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "";
        
        var connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUsername};Password={dbPassword}";
        
        // Database
        services.AddDbContext<UserDbContext>(options =>
            options.UseNpgsql(connectionString));
        
        // Register services
        services.AddScoped<UserService>();
        services.AddScoped<WatchlistService>();
        
        // Get Auth0 configuration from environment variables
        var auth0Domain = Environment.GetEnvironmentVariable("AUTH0_DOMAIN") ?? configuration["Auth0:Domain"];
        var auth0Audience = Environment.GetEnvironmentVariable("AUTH0_AUDIENCE") ?? configuration["Auth0:Audience"];
        
        // Configure JWT Bearer authentication (same Auth0 settings as gateway)
        // The gateway validates the token first, but we configure it here too
        // so ASP.NET populates User.Claims automatically from the forwarded token
        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                var authority = !string.IsNullOrEmpty(auth0Domain) && !auth0Domain.StartsWith("https://", StringComparison.OrdinalIgnoreCase)
                    ? $"https://{auth0Domain}/"
                    : auth0Domain;

                options.Authority = authority;
                options.Audience = auth0Audience;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = ClaimTypes.NameIdentifier,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true
                };

                // Optional: logging for debugging
                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = ctx =>
                    {
                        Console.WriteLine($"[UserService] JWT auth failed: {ctx.Exception?.Message}");
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = ctx =>
                    {
                        Console.WriteLine($"[UserService] JWT validated for: {ctx.Principal?.FindFirst("sub")?.Value}");
                        return Task.CompletedTask;
                    }
                };
            });

        services.AddAuthorization();
        
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
        app.UseAuthentication();
        app.UseAuthorization();
        
        app.MapControllers();
    }
}