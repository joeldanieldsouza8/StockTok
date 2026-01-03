using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace ApiGateway;

public class Program
{
    public static async Task Main(string[] args)
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

        // Configure JWT Bearer using Auth0 settings from configuration
        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                // Build Authority from either Auth0:Authority or Auth0:Domain
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

                // Helpful logging during development to see why a token failed
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

        // Add YARP reverse proxy and load routes/clusters from configuration
        services.AddReverseProxy().LoadFromConfig(configuration.GetSection("ReverseProxy"));

        // Authorization: we register it but do not enforce it globally. We enforce
        // authentication selectively in middleware for specific path prefixes.
        services.AddAuthorization();

        services.AddControllers();

        // Basic CORS config for local development. Tighten this in production.
        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", policy =>
            {
                policy.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader();
            });
        });

        services.AddHealthChecks();
    }

    private static void ConfigureMiddleware(WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseRouting();

        app.UseCors("CorsPolicy");

        app.UseAuthentication();
        app.UseAuthorization();

        // List of path prefixes that require an authenticated user.
        // Modify this list to protect other routes as needed.
        var protectedPrefixes = new[] { "/api/users", "/api/watchlists", "/dummy", "/api/posts", "/api/comments", "/api/news", "/api/feed", "/feed" };

        // Inline middleware: only challenge (401) if the request targets a protected
        // prefix and the user is not authenticated. Other routes are left untouched.
        app.Use(async (context, next) =>
        {
            var path = context.Request.Path;
            var requiresAuth = protectedPrefixes.Any(p => path.StartsWithSegments(p, StringComparison.OrdinalIgnoreCase));
            if (requiresAuth)
            {
                if (context.User?.Identity?.IsAuthenticated != true)
                {
                    // Challenge will trigger the JwtBearer handler to return 401
                    await context.ChallengeAsync();
                    return;
                }
            }
            await next();
        });

        app.MapHealthChecks("/health");
        app.MapControllers();

        // Map YARP last
        // take precedence over proxied routes.
        app.MapReverseProxy();
    }}