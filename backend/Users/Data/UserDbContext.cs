using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Users.Models;

namespace Users.Data;

public class UserDbContext : DbContext
{
    public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // new UserEntityTypeConfiguration().Configure(modelBuilder.Entity<Models.User>());

        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
