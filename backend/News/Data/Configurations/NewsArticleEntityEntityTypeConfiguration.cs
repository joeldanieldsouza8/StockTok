using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using News.Models;

namespace News.Data.Configurations;

public class NewsArticleEntityEntityTypeConfiguration : IEntityTypeConfiguration<NewsArticleEntity>
{
    public void Configure(EntityTypeBuilder<NewsArticleEntity> builder)
    {
        builder.ToTable("NewsArticleEntities");
        
        // Primary key
        builder.HasKey(e => e.Id);
        
        builder.Property(e => e.Symbol).IsRequired();
        builder.Property(e => e.Name).IsRequired();
    }
}