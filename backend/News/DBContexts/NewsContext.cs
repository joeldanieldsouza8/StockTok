using System.Reflection;
using Microsoft.EntityFrameworkCore;
using News.Models;

namespace News.DBContexts;

public class NewsContext : DbContext
{
    public NewsContext(DbContextOptions<NewsContext> options) : base(options)
    {
    }
    
    public DbSet<NewsArticle> NewsArticles { get; set; }
    public DbSet<NewsArticleEntity> NewsArticleEntities { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasDefaultSchema("News");

        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}