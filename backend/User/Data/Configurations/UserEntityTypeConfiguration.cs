using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace User.Data.Configurations;

public class UserEntityTypeConfiguration : IEntityTypeConfiguration<Models.User>
{
    public void Configure(EntityTypeBuilder<Models.User> builder)
    {
        builder.ToTable("Users");
        
        // Configure the primary key
        builder.HasKey(x => x.Id);
        
        // Configure the properties (database columns in this Users table) with constraints
        builder.Property(u => u.Id)
            .ValueGeneratedOnAdd();
        
        builder.Property(u => u.Username)
            .IsRequired()
            .HasMaxLength(50);
        
        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(255);
        
        // [TODO] Configure indexes for performance and uniqueness
    }
}