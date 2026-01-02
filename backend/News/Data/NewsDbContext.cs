using Microsoft.EntityFrameworkCore;
using News.Models;
using System.Reflection;
using static News.Models.NewsArticle;

namespace News.Data;

public class NewsDbContext : DbContext
{
    public NewsDbContext(DbContextOptions<NewsDbContext> options) : base(options)
    {
    }
    
    public DbSet<NewsArticle> NewsArticles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasDefaultSchema("News");

        modelBuilder.Entity<NewsArticleEntity>()
        .ToTable("NewsArticleEntities");

        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}