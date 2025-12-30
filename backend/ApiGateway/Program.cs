using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace ApiGateway;

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

        // Configure CORS to allow the Frontend to communicate with the Gateway
        services.AddCors(options =>
        {
            options.AddPolicy("AllowNextJs", policy =>
            {
                policy.WithOrigins("http://localhost:3000") 
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        // Configure JWT Bearer using Auth0 settings
        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                var authority = configuration["Auth0:Authority"];
                if (string.IsNullOrEmpty(authority))
                {
                    var domain = configuration["Auth0:Domain"];
                    if (!string.IsNullOrEmpty(domain))
                    {
                        authority = domain.StartsWith("https://", StringComparison.OrdinalIgnoreCase)
                            ? domain
                            : $"https://{domain}/";
                    }
                }

                options.Authority = authority;
                options.Audience = configuration["Auth0:Audience"];
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = ClaimTypes.NameIdentifier
                };

                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = ctx =>
                    {
                        Console.WriteLine($"Jwt auth failed: {ctx.Exception?.Message}");
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = ctx =>
                    {
                        Console.WriteLine("Jwt auth succeeded for: " + ctx.Principal?.FindFirst("sub")?.Value);
                        return Task.CompletedTask;
                    }
                };
            });

        // Add YARP reverse proxy
        services.AddReverseProxy()
                .LoadFromConfig(configuration.GetSection("ReverseProxy"));

        services.AddAuthorization();
        services.AddControllers();
        services.AddHealthChecks();
    }

    private static void ConfigureMiddleware(WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseRouting();

        // Use the specific Next.js CORS policy
        app.UseCors("AllowNextJs");

        app.UseAuthentication();
        app.UseAuthorization();

        // List of path prefixes that require an authenticated user.
        // Modify this list to protect other routes as needed.
        var protectedPrefixes = new[] { "/api/users", "/api/watchlists", "/dummy", "/api/news" /* add other prefixes here */ };

        app.Use(async (context, next) =>
        {
            var path = context.Request.Path;
            var requiresAuth = protectedPrefixes.Any(p => path.StartsWithSegments(p, StringComparison.OrdinalIgnoreCase));
            if (requiresAuth)
            {
                if (context.User?.Identity?.IsAuthenticated != true)
                {
                    await context.ChallengeAsync();
                    return;
                }
            }
            await next();
        });

        app.MapHealthChecks("/health");
        app.MapControllers();
        
        // Map YARP last
        app.MapReverseProxy();
    }
}