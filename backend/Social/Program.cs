
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using Social.Models;

namespace Social
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

            // Add CORS services
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,policy => {
                    policy.WithOrigins("http://localhost:3000")
                        .WithHeaders("Content-Type", "Accept", "Authorization").AllowAnyMethod();
                });
            });

            // Add services to the container.

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            builder.Services.AddDbContext<PostDBContext>(options =>
            {
                options.UseNpgsql(connectionString);
            });

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            //app.UseHttpsRedirection();

            app.UseCors(); // IMPORTANT

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
