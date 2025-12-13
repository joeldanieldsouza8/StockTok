using System.Reflection;
using Microsoft.EntityFrameworkCore;
using User.Data.Configurations;

namespace User.Data;

public class UserDbContext : DbContext
{
    public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }
    
    public DbSet<Models.User>  Users { get; set; }
    
    // DbSets for watchlist feature
    public DbSet<Models.Watchlist> Watchlists { get; set; }
    public DbSet<Models.Ticker> Tickers { get; set; }
    public DbSet<Models.WatchlistTicker> WatchlistTickers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // new UserEntityTypeConfiguration().Configure(modelBuilder.Entity<Models.User>());
        
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}