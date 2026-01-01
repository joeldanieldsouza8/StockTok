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

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                // Prioritize Auth0:Authority, fall back to Auth0:Domain
                var authority = configuration["Auth0:Authority"] ?? configuration["Auth0:Domain"];
                
                if (!string.IsNullOrEmpty(authority) && !authority.StartsWith("https://"))
                {
                    authority = $"https://{authority}/";
                }

                options.Authority = authority;
                options.Audience = configuration["Auth0:Audience"];

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = ClaimTypes.NameIdentifier,
                    ValidateIssuer = true,
                    ValidateAudience = true
                };

                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = ctx =>
                    {
                        Console.WriteLine($"[Gateway] Jwt auth failed: {ctx.Exception?.Message}");
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = ctx =>
                    {
                        Console.WriteLine($"[Gateway] Jwt auth succeeded for: {ctx.Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value}");
                        return Task.CompletedTask;
                    }
                };
            });

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
        app.UseCors("AllowNextJs");

        app.UseAuthentication();
        app.UseAuthorization();

        var protectedPrefixes = new[] { 
            "/api/users", 
            "/api/watchlists", 
            "/api/comments", 
            "/api/posts",
            "/dummy" 
        };

        app.Use(async (context, next) =>
        {
            var path = context.Request.Path;
            var requiresAuth = protectedPrefixes.Any(p => path.StartsWithSegments(p, StringComparison.OrdinalIgnoreCase));
            
            if (requiresAuth && context.User?.Identity?.IsAuthenticated != true)
            {
                await context.ChallengeAsync();
                return;
            }
            await next();
        });

        app.MapHealthChecks("/health");
        app.MapControllers();
        app.MapReverseProxy();
    }
}