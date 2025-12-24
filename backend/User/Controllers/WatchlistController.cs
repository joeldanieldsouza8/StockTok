using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using User.Data;
using User.DTOs.Watchlist;
using User.Services;

namespace User.Controllers;

[ApiController]
[Route("api/watchlists")]
[Authorize] // Requires valid JWT - gateway forwards the token
public class WatchlistController : ControllerBase
{
    private readonly WatchlistService _watchlistService;
    private readonly UserDbContext _context;

    public WatchlistController(WatchlistService watchlistService, UserDbContext context)
    {
        _watchlistService = watchlistService;
        _context = context;
    }

    /// <summary>
    /// Get all watchlists for the authenticated user
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetWatchlists()
    {
        var userId = await GetUserIdFromToken();
        if (userId == null)
            return Unauthorized(new { error = "User not found" });

        var watchlists = await _watchlistService.GetUserWatchlistsAsync(userId.Value);
        return Ok(watchlists);
    }

    /// <summary>
    /// Get a specific watchlist by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetWatchlist(Guid id)
    {
        var userId = await GetUserIdFromToken();
        if (userId == null)
            return Unauthorized(new { error = "User not found" });

        var watchlist = await _watchlistService.GetWatchlistByIdAsync(id, userId.Value);
        if (watchlist == null)
            return NotFound(new { error = "Watchlist not found" });

        return Ok(watchlist);
    }

    /// <summary>
    /// Get the top N most common tickers across user's watchlists
    /// </summary>
    [HttpGet("top-tickers")]
    public async Task<IActionResult> GetTopTickers([FromQuery] int count = 3)
    {
        var userId = await GetUserIdFromToken();
        if (userId == null)
            return Unauthorized(new { error = "User not found" });
        
        var topTickers = await _watchlistService.GetTopTickersAsync(userId.Value, count);
        return Ok(topTickers);
    }

    /// <summary>
    /// Create a new watchlist
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateWatchlist([FromBody] CreateWatchlistRequest request)
    {
        var userId = await GetUserIdFromToken();
        if (userId == null)
            return Unauthorized(new { error = "User not found" });

        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { error = "Watchlist name is required" });

        var (watchlist, error) = await _watchlistService.CreateWatchlistAsync(userId.Value, request);
        
        if (error != null)
            return BadRequest(new { error });
            
        return CreatedAtAction(nameof(GetWatchlist), new { id = watchlist!.Id }, watchlist);
    }

    /// <summary>
    /// Update a watchlist's name
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateWatchlist(Guid id, [FromBody] UpdateWatchlistRequest request)
    {
        var userId = await GetUserIdFromToken();
        if (userId == null)
            return Unauthorized(new { error = "User not found" });

        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { error = "Watchlist name is required" });

        var (watchlist, error) = await _watchlistService.UpdateWatchlistAsync(id, userId.Value, request);
        
        if (error != null)
        {
            if (error == "Watchlist not found")
                return NotFound(new { error });
            return BadRequest(new { error });
        }

        return Ok(watchlist);
    }

    /// <summary>
    /// Delete a watchlist
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteWatchlist(Guid id)
    {
        var userId = await GetUserIdFromToken();
        if (userId == null)
            return Unauthorized(new { error = "User not found" });

        var deleted = await _watchlistService.DeleteWatchlistAsync(id, userId.Value);
        if (!deleted)
            return NotFound(new { error = "Watchlist not found" });

        return NoContent();
    }

    /// <summary>
    /// Add a ticker to a watchlist
    /// </summary>
    [HttpPost("{id:guid}/tickers")]
    public async Task<IActionResult> AddTicker(Guid id, [FromBody] AddTickerRequest request)
    {
        var userId = await GetUserIdFromToken();
        if (userId == null)
            return Unauthorized(new { error = "User not found" });

        if (string.IsNullOrWhiteSpace(request.TickerId))
            return BadRequest(new { error = "Ticker ID is required" });

        var (watchlist, error) = await _watchlistService.AddTickerToWatchlistAsync(id, userId.Value, request);
        
        if (error != null)
        {
            if (error == "Watchlist not found")
                return NotFound(new { error });
            return BadRequest(new { error });
        }

        return Ok(watchlist);
    }

    /// <summary>
    /// Remove a ticker from a watchlist
    /// </summary>
    [HttpDelete("{id:guid}/tickers/{tickerId}")]
    public async Task<IActionResult> RemoveTicker(Guid id, string tickerId)
    {
        var userId = await GetUserIdFromToken();
        if (userId == null)
            return Unauthorized(new { error = "User not found" });

        var (watchlist, error) = await _watchlistService.RemoveTickerFromWatchlistAsync(id, userId.Value, tickerId);
        
        if (error != null)
        {
            if (error == "Watchlist not found")
                return NotFound(new { error });
            return BadRequest(new { error });
        }

        return Ok(watchlist);
    }

    /// <summary>
    /// Gets the user ID from the JWT token, creating the user if they don't exist.
    /// This allows new Auth0 users to automatically be added to the database on first request.
    /// </summary>
    private async Task<Guid?> GetUserIdFromToken()
    {
        // The 'sub' claim contains the Auth0 subject ID (e.g., "auth0|123456")
        var auth0SubjectId = User.FindFirst("sub")?.Value 
                             ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(auth0SubjectId))
            return null;

        // Try to find existing user
        var user = await _context.Users
            .Where(u => u.Auth0SubjectId == auth0SubjectId)
            .FirstOrDefaultAsync();

        // Create user if they don't exist
        if (user == null)
        {
            user = new Models.User
            {
                Id = Guid.NewGuid(),
                Auth0SubjectId = auth0SubjectId,
                FullName = User.FindFirst("name")?.Value ?? "Unknown",
                Username = User.FindFirst("nickname")?.Value ?? auth0SubjectId,
                Email = User.FindFirst("email")?.Value ?? "",
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        return user.Id;
    }
}