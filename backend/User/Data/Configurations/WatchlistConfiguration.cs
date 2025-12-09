using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using User.Models;

namespace User.Data.Configurations;

public class WatchlistConfiguration : IEntityTypeConfiguration<Watchlist>
{
    public void Configure(EntityTypeBuilder<Watchlist> builder)
    {
        builder.ToTable("watchlists");
        
        builder.HasKey(w => w.Id);
        
        builder.Property(w => w.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();
        
        builder.Property(w => w.UserId)
            .HasColumnName("user_id")
            .IsRequired();
        
        builder.Property(w => w.Name)
            .HasColumnName("name")
            .HasMaxLength(100)
            .IsRequired();
        
        builder.Property(w => w.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();
        
        builder.Property(w => w.UpdatedAt)
            .HasColumnName("updated_at")
            .IsRequired();
        
        // Relationship: User has many Watchlists
        builder.HasOne(w => w.User)
            .WithMany(u => u.Watchlists)
            .HasForeignKey(w => w.UserId)
            .OnDelete(DeleteBehavior.Cascade); // Delete watchlists when user is deleted
    }
}