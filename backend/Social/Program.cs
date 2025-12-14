
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
                options.AddPolicy(name: MyAllowSpecificOrigins, policy => {
                    policy.WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()  
                        .AllowAnyMethod()   
                        .AllowCredentials();
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

            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider
                    .GetRequiredService<PostDBContext>(); 

                // This command applies any pending migrations and creates the schema
                dbContext.Database.Migrate();
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            //app.UseHttpsRedirection();

            app.UseCors(MyAllowSpecificOrigins); // IMPORTANT

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
