using Microsoft.EntityFrameworkCore;
using User.Models;

namespace User.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(UserDbContext context)
    {
        // Only seed if database is empty
        if (await context.Users.AnyAsync())
            return;

        Console.WriteLine("Seeding database...");

        var testUser = new Models.User
        {
            Id = Guid.NewGuid(),
            Auth0SubjectId = "auth0|693c836dacb17371fc389700", // Created with Auth0
            FullName = "Yo",
            Username = "Wassup",
            Email = "test@example.com",
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        context.Users.Add(testUser);

        // Create some sample tickers
        var tickers = new List<Ticker>
        {
            new() { Id = "AAPL", StockName = "Apple Inc." },
            new() { Id = "GOOGL", StockName = "Alphabet Inc." },
            new() { Id = "MSFT", StockName = "Microsoft Corporation" },
            new() { Id = "NVDA", StockName = "NVIDIA Corporation" },
            new() { Id = "TSLA", StockName = "Tesla Inc." }
        };

        context.Tickers.AddRange(tickers);

        // Create a sample watchlist
        var watchlist = new Watchlist
        {
            Id = Guid.NewGuid(),
            UserId = testUser.Id,
            Name = "Tech Stocks",
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        context.Watchlists.Add(watchlist);

        // Add some tickers to the watchlist
        context.WatchlistTickers.AddRange(
            new WatchlistTicker { WatchlistId = watchlist.Id, TickerId = "AAPL" },
            new WatchlistTicker { WatchlistId = watchlist.Id, TickerId = "NVDA" }
        );

        await context.SaveChangesAsync();

        Console.WriteLine($"Seeded user: {testUser.Email} (Auth0: {testUser.Auth0SubjectId})");
        Console.WriteLine($"Seeded watchlist: {watchlist.Name} with 2 tickers");
    }
}