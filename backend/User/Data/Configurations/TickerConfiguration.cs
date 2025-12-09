using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using User.Models;

namespace User.Data.Configurations;

public class TickerConfiguration : IEntityTypeConfiguration<Ticker>
{
    public void Configure(EntityTypeBuilder<Ticker> builder)
    {
        // Table name
        builder.ToTable("tickers");
        
        // Primary key -> ticker symbol
        builder.HasKey(t => t.Id);
        
        // Id is the ticker symbol (e.g., "AAPL") - not auto-generated
        builder.Property(t => t.Id)
            .HasColumnName("id")
            .HasMaxLength(10)
            .IsRequired();
        
        builder.Property(t => t.StockName)
            .HasColumnName("stock_name")
            .HasMaxLength(255)
            .IsRequired();
    }
}