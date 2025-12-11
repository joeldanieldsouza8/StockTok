using User.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;  // For JwtBearerDefaults
using Microsoft.EntityFrameworkCore;  // For DbContext
using Microsoft.IdentityModel.Tokens;  // Add for TokenValidationParameters
using System.Security.Claims;  // Add for ClaimTypes


namespace User;

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

                options.MapInboundClaims = false; // keep original claim names

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = "sub",
                    RoleClaimType = "roles"
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

        services.AddAuthorization();

        
        services.AddDbContext<UserDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
        
        services.AddScoped<Services.UserService>();
        
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