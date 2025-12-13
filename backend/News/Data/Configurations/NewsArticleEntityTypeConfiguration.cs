using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using News.Models;

namespace News.Data.Configurations;

public class NewsArticleEntityTypeConfiguration : IEntityTypeConfiguration<NewsArticle>
{
    public void Configure(EntityTypeBuilder<NewsArticle> builder)
    {
        builder.ToTable("NewsArticles");
        
        // Configure the primary key
        builder.HasKey(u => u.Uuid);
        
        builder.Property(n => n.Title).IsRequired();
        builder.Property(n => n.Url).IsRequired();
        
        // Configure the one-to-many relationship
        // NewsArticleEntities (Many) --> NewsArticle (One)
        builder.HasMany(n => n.NewsArticleEntities)
            .WithOne(e => e.NewsArticle)
            .HasForeignKey(e => e.ArticleID)

            // If a news article is deleted, then delete its entities too
            .OnDelete(DeleteBehavior.Cascade);
    }
} 