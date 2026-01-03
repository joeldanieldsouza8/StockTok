using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Social.Data;
using Posts.Services;
using Posts.Hubs;
using System.Text.Json;   

var builder = WebApplication.CreateBuilder(args);

// --- DATABASE CONFIG ---
builder.Services.AddDbContext<PostDBContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("SocialDB")));

builder.Services.AddSignalR(); 

// --- AUTHENTICATION ---
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var domain = builder.Configuration["Auth0:Domain"];
        options.Authority = domain.StartsWith("https://") ? domain : $"https://{domain}/";
        options.Audience = builder.Configuration["Auth0:Audience"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            NameClaimType = ClaimTypes.NameIdentifier
        };
    });

// ---  SERVICES ---
builder.Services.AddScoped<PostsService>();
builder.Services.AddScoped<CommentsService>();

builder.Services
    .AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// --- MIDDLEWAREE ---
app.UseRouting();

app.UseCors("_myAllowSpecificOrigins"); 

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHub<CommentHub>("/commentHub"); 

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<PostDBContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred creating the DB.");
    }
}

app.Run();