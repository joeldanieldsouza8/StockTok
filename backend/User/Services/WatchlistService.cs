using Microsoft.EntityFrameworkCore;
using User.Data;
using User.DTOs.Watchlist;
using User.Models;

namespace User.Services;

public class WatchlistService
{
    private readonly UserDbContext _context;
    
    public WatchlistService(UserDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all watchlists for a user
    /// </summary>
    public async Task<List<WatchlistResponse>> GetUserWatchlistsAsync(Guid userId)
    {
        var watchlists = await _context.Watchlists
            .Where(w => w.UserId == userId)
            .Include(w => w.WatchlistTickers)
            .ThenInclude(wt => wt.Ticker)
            .ToListAsync();
            
        return watchlists.Select(MapToResponse).ToList();
    }
    
    
    /// <summary>
    /// Get the top 'n' tickers for a user
    /// </summary>
    public async Task<List<TopTickersResponse>> GetTopTickersAsync(Guid userId, int n = 3)
    {
        var topTickers = await _context.WatchlistTickers
            .Where(wt => w.Watchlist.UserId == userId)
            .GroupBy(wt => new { wt.TickerId, wt.StockName })
            .Select(g => new TopTickersResponse
            {
                Id = g.Key.TickerId,
                StockName = g.Key.StockName,
                Count = g.Count()
            })
            .OrderByDescending(t => t.Count)
            .Take(n)
            .ToListAsync()

        return topTickers;
    }
    

    /// <summary>
    /// Get a specific watchlist by ID
    /// </summary>
    public async Task<WatchlistResponse?> GetWatchlistByIdAsync(Guid watchlistId, Guid userId)
    {
        var watchlist = await _context.Watchlists
            .Where(w => w.Id == watchlistId && w.UserId == userId)
            .Include(w => w.WatchlistTickers)
            .ThenInclude(wt => wt.Ticker)
            .FirstOrDefaultAsync();
            
        return watchlist == null ? null : MapToResponse(watchlist);
    }

    /// <summary>
    /// Check if a watchlist name already exists for a user
    /// </summary>
    public async Task<bool> WatchlistNameExistsAsync(Guid userId, string name, Guid? excludeWatchlistId = null)
    {
        var query = _context.Watchlists
            .Where(w => w.UserId == userId && w.Name.ToLower() == name.ToLower());

        // Exclude a specific watchlist (used when updating)
        if (excludeWatchlistId.HasValue)
            query = query.Where(w => w.Id != excludeWatchlistId.Value);

        return await query.AnyAsync();
    }

    /// <summary>
    /// Create a new watchlist for a user.
    /// Returns null if a watchlist with the same name already exists.
    /// </summary>
    public async Task<(WatchlistResponse? Watchlist, string? Error)> CreateWatchlistAsync(Guid userId, CreateWatchlistRequest request)
    {
        // Check for duplicate name
        if (await WatchlistNameExistsAsync(userId, request.Name))
        {
            return (null, "A watchlist with this name already exists");
        }

        var watchlist = new Watchlist
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = request.Name,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        _context.Watchlists.Add(watchlist);
        await _context.SaveChangesAsync();

        return (MapToResponse(watchlist), null);
    }

    /// <summary>
    /// Update a watchlist's name.
    /// Returns error if the new name already exists for another watchlist.
    /// </summary>
    public async Task<(WatchlistResponse? Watchlist, string? Error)> UpdateWatchlistAsync(Guid watchlistId, Guid userId, UpdateWatchlistRequest request)
    {
        var watchlist = await _context.Watchlists
            .Where(w => w.Id == watchlistId && w.UserId == userId)
            .Include(w => w.WatchlistTickers)
            .ThenInclude(wt => wt.Ticker)
            .FirstOrDefaultAsync();

        if (watchlist == null)
            return (null, "Watchlist not found");

        // Check for duplicate name (excluding current watchlist)
        if (await WatchlistNameExistsAsync(userId, request.Name, watchlistId))
        {
            return (null, "A watchlist with this name already exists");
        }

        watchlist.Name = request.Name;
        watchlist.UpdatedAt = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync();

        return (MapToResponse(watchlist), null);
    }

    /// <summary>
    /// Delete a watchlist
    /// </summary>
    public async Task<bool> DeleteWatchlistAsync(Guid watchlistId, Guid userId)
    {
        var watchlist = await _context.Watchlists
            .Where(w => w.Id == watchlistId && w.UserId == userId)
            .FirstOrDefaultAsync();

        if (watchlist == null)
            return false;

        _context.Watchlists.Remove(watchlist);
        await _context.SaveChangesAsync();

        return true;
    }

    /// <summary>
    /// Add a ticker to a watchlist.
    /// Returns error if ticker already exists in the watchlist.
    /// </summary>
    public async Task<(WatchlistResponse? Watchlist, string? Error)> AddTickerToWatchlistAsync(Guid watchlistId, Guid userId, AddTickerRequest request)
    {
        var watchlist = await _context.Watchlists
            .Where(w => w.Id == watchlistId && w.UserId == userId)
            .Include(w => w.WatchlistTickers)
            .ThenInclude(wt => wt.Ticker)
            .FirstOrDefaultAsync();

        if (watchlist == null)
            return (null, "Watchlist not found");

        // Check if the ticker already exists in this watchlist
        var existingEntry = watchlist.WatchlistTickers
            .FirstOrDefault(wt => wt.TickerId.ToUpper() == request.TickerId.ToUpper());

        if (existingEntry != null)
            return (null, $"Ticker '{request.TickerId.ToUpper()}' is already in this watchlist");

        // Normalize ticker ID to uppercase
        var tickerId = request.TickerId.ToUpper();

        // Ensure ticker exists in the Tickers table (create if not)
        var ticker = await _context.Tickers.FindAsync(tickerId);
        if (ticker == null)
        {
            ticker = new Ticker
            {
                Id = tickerId,
                StockName = request.StockName
            };
            _context.Tickers.Add(ticker);
        }

        // Create the junction table entry
        var watchlistTicker = new WatchlistTicker
        {
            WatchlistId = watchlistId,
            TickerId = tickerId
        };

        _context.WatchlistTickers.Add(watchlistTicker);
        watchlist.UpdatedAt = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync();

        // Reload to get updated tickers list
        await _context.Entry(watchlist)
            .Collection(w => w.WatchlistTickers)
            .Query()
            .Include(wt => wt.Ticker)
            .LoadAsync();

        return (MapToResponse(watchlist), null);
    }

    /// <summary>
    /// Remove a ticker from a watchlist
    /// </summary>
    public async Task<(WatchlistResponse? Watchlist, string? Error)> RemoveTickerFromWatchlistAsync(Guid watchlistId, Guid userId, string tickerId)
    {
        var watchlist = await _context.Watchlists
            .Where(w => w.Id == watchlistId && w.UserId == userId)
            .Include(w => w.WatchlistTickers)
            .ThenInclude(wt => wt.Ticker)
            .FirstOrDefaultAsync();

        if (watchlist == null)
            return (null, "Watchlist not found");

        var watchlistTicker = watchlist.WatchlistTickers
            .FirstOrDefault(wt => wt.TickerId.ToUpper() == tickerId.ToUpper());

        if (watchlistTicker == null)
            return (null, $"Ticker '{tickerId.ToUpper()}' is not in this watchlist");

        _context.WatchlistTickers.Remove(watchlistTicker);
        watchlist.UpdatedAt = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync();

        // Remove from in-memory collection for accurate response
        watchlist.WatchlistTickers.Remove(watchlistTicker);

        return (MapToResponse(watchlist), null);
    }

    /// <summary>
    /// Maps a Watchlist entity to a WatchlistResponse DTO
    /// </summary>
    private static WatchlistResponse MapToResponse(Watchlist watchlist)
    {
        return new WatchlistResponse
        {
            Id = watchlist.Id,
            Name = watchlist.Name,
            CreatedAt = watchlist.CreatedAt,
            UpdatedAt = watchlist.UpdatedAt,
            Tickers = watchlist.WatchlistTickers
                .Select(wt => new TickerResponse
                {
                    Id = wt.Ticker.Id,
                    StockName = wt.Ticker.StockName
                })
                .ToList()
        };
    }
}