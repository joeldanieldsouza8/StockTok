using System;
using Microsoft.EntityFrameworkCore;
using NewsMicroservice.Models;
using Microsoft.Extensions.Configuration;

namespace NewsMicroservice.DBContexts
{
    public class NewsContext : DbContext
    {
        protected readonly IConfiguration Configuration;
        public NewsContext(IConfiguration configuration) {
            Configuration = configuration;
        }

        public NewsContext(DbContextOptions<NewsContext> options) : base(options)
        { }

        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)

        {

            // WebApiDatabase contains connection string to the database inside appsettings.json
            optionsBuilder.UseNpgsql(Configuration.GetConnectionString("WebApiDatabase"));

        }

        public DbSet<NewsModel> NewsBuffer { get; set; }
    }
}