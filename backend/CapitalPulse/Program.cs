using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace CapitalPulse;

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

        // Add controllers
        services.AddControllers();

        var domain = $"https://{configuration["Auth0:Domain"]}/";
        var audience = configuration["Auth0:Audience"];

        // Configure JWT Bearer authentication
        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority = domain;
                options.Audience = audience;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    // ValidAudiences = [audience],
                    NameClaimType = ClaimTypes.NameIdentifier
                };
            });
    }

    private static void ConfigureMiddleware(WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {

        }

        // app.UseHttpsRedirection(); // TODO: IMPORTANT: Uncomment when in production

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
    }
}