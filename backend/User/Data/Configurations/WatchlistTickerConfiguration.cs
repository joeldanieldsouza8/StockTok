using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using User.Models;

namespace User.Data.Configurations;

public class WatchlistTickerConfiguration : IEntityTypeConfiguration<WatchlistTicker>
{
    public void Configure(EntityTypeBuilder<WatchlistTicker> builder)
    {
        builder.ToTable("watchlist_tickers");
        
        // Composite primary key - combination of both foreign keys
        builder.HasKey(wt => new { wt.WatchlistId, wt.TickerId });
        
        builder.Property(wt => wt.WatchlistId)
            .HasColumnName("watchlist_id");
        
        builder.Property(wt => wt.TickerId)
            .HasColumnName("ticker_id");
        
        // Relationship: WatchlistTicker -> Watchlist
        builder.HasOne(wt => wt.Watchlist)
            .WithMany(w => w.WatchlistTickers)
            .HasForeignKey(wt => wt.WatchlistId)
            .OnDelete(DeleteBehavior.Cascade); // Remove entries when watchlist is deleted
        
        // Relationship: WatchlistTicker -> Ticker
        builder.HasOne(wt => wt.Ticker)
            .WithMany(t => t.WatchlistTickers)
            .HasForeignKey(wt => wt.TickerId)
            .OnDelete(DeleteBehavior.Cascade); // Remove entries when ticker is deleted
    }
}