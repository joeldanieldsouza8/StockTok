
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

// -----------------------------------------------------------------------------
// ApiGateway/Program.cs
// -----------------------------------------------------------------------------
// What this file does (summary)
// - Configures the Api Gateway to validate JWTs issued by Auth0.
// - Loads YARP (Microsoft.ReverseProxy) configuration from `appsettings.json`
//   (section: ReverseProxy) to route traffic to downstream services.
// - Adds a small middleware that enforces authentication for a configurable
//   set of protected route prefixes (for example: `/api/users`).
// - Adds CORS, HealthChecks and basic logging hooks for JWT validation errors.
//
// How it works (brief)
// 1. Authentication: JwtBearer middleware validates incoming Bearer tokens using
//    the Authority (Auth0 domain/metadata) and Audience from configuration.
// 2. Routing: YARP reads routes and clusters from configuration and proxies
//    matching requests to the configured downstream addresses.
// 3. Selective protection: a small inline middleware checks the request path
//    and only challenges unauthenticated requests when the path starts with any
//    of the configured protected prefixes (so you can protect only /api/users).
// 4. Header forwarding: transforms in `appsettings.json` control which headers
//    the gateway forwards to downstream (example: Authorization).
//
// What has been implemented in this repo (so far)
// - JwtBearer authentication wired with Authority/Audience (Auth0 values
//   read from configuration). Token validation logs are printed to the console
//   for easier debugging during development.
// - YARP reverse proxy is loaded from configuration (ReverseProxy section).
// - A sample `UserController` exists in the User service to help test routing.
// - A protected `/dummy` controller is provided in the ApiGateway to test
//   Auth0 token validation from the frontend.
//
// Suggested further improvements / TODOs
// - Use more granular per-route policies (e.g., different scopes or roles).
// - Add robust error handling and structured logging (Serilog / ApplicationInsights).
// - Add rate-limiting, retries, and circuit-breaker policies (Polly / built-in).
// - Integrate OpenTelemetry for traces and metrics and export to Prometheus.
// - Move secrets (Auth0 client secrets) to a secure store / environment variables.
// - Add integration tests for proxying + authentication using WebApplicationFactory.
// - Add docker-compose to run gateway + services + Postgres for local dev.
// -----------------------------------------------------------------------------

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
        var protectedPrefixes = new[] { "/api/users", "/dummy" /* add other prefixes here */ };

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

        // Map the reverse proxy last so controller routes (health, gateway endpoints)
        // take precedence over proxied routes.
        app.MapReverseProxy();
    }
}
