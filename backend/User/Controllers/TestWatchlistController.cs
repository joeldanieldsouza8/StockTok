// ⚠️ TEMPORARY TEST CONTROLLER - DELETE BEFORE PRODUCTION ⚠️
// This controller bypasses authentication for testing CRUD operations

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using User.Data;
using User.DTOs.Watchlist;
using User.Services;

namespace User.Controllers;

[ApiController]
[Route("api/watchlists/test")]
public class TestWatchlistController : ControllerBase
{
    private readonly WatchlistService _watchlistService;
    private readonly UserDbContext _context;

    public TestWatchlistController(WatchlistService watchlistService, UserDbContext context)
    {
        _watchlistService = watchlistService;
        _context = context;
    }

    /// <summary>
    /// Creates a test user and returns their ID (run this first)
    /// </summary>
    [HttpPost("setup")]
    public async Task<IActionResult> SetupTestUser()
    {
        // Check if test user already exists
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == "testuser");

        if (existingUser != null)
        {
            return Ok(new { 
                message = "Test user already exists", 
                userId = existingUser.Id,
                username = existingUser.Username
            });
        }

        // Create test user
        var testUser = new Models.User
        {
            Id = Guid.NewGuid(),
            Auth0SubjectId = "test|123456",
            FullName = "Test User",
            Username = "testuser",
            Email = "test@example.com",
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        _context.Users.Add(testUser);
        await _context.SaveChangesAsync();

        return Ok(new { 
            message = "Test user created", 
            userId = testUser.Id,
            username = testUser.Username
        });
    }

    /// <summary>
    /// Get all watchlists for test user
    /// </summary>
    [HttpGet("{userId:guid}")]
    public async Task<IActionResult> GetWatchlists(Guid userId)
    {
        var watchlists = await _watchlistService.GetUserWatchlistsAsync(userId);
        return Ok(watchlists);
    }

    /// <summary>
    /// Get a specific watchlist
    /// </summary>
    [HttpGet("{userId:guid}/{watchlistId:guid}")]
    public async Task<IActionResult> GetWatchlist(Guid userId, Guid watchlistId)
    {
        var watchlist = await _watchlistService.GetWatchlistByIdAsync(watchlistId, userId);
        if (watchlist == null)
            return NotFound(new { error = "Watchlist not found" });
        return Ok(watchlist);
    }

    /// <summary>
    /// Create a watchlist
    /// </summary>
    [HttpPost("{userId:guid}")]
    public async Task<IActionResult> CreateWatchlist(Guid userId, [FromBody] CreateWatchlistRequest request)
    {
        var (watchlist, error) = await _watchlistService.CreateWatchlistAsync(userId, request);
        
        if (error != null)
            return BadRequest(new { error });
            
        return Created($"/api/test/watchlists/{userId}/{watchlist!.Id}", watchlist);
    }

    /// <summary>
    /// Update a watchlist
    /// </summary>
    [HttpPut("{userId:guid}/{watchlistId:guid}")]
    public async Task<IActionResult> UpdateWatchlist(Guid userId, Guid watchlistId, [FromBody] UpdateWatchlistRequest request)
    {
        var (watchlist, error) = await _watchlistService.UpdateWatchlistAsync(watchlistId, userId, request);
        
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
    [HttpDelete("{userId:guid}/{watchlistId:guid}")]
    public async Task<IActionResult> DeleteWatchlist(Guid userId, Guid watchlistId)
    {
        var deleted = await _watchlistService.DeleteWatchlistAsync(watchlistId, userId);
        if (!deleted)
            return NotFound(new { error = "Watchlist not found" });
        return NoContent();
    }

    /// <summary>
    /// Add a ticker to a watchlist
    /// </summary>
    [HttpPost("{userId:guid}/{watchlistId:guid}/tickers")]
    public async Task<IActionResult> AddTicker(Guid userId, Guid watchlistId, [FromBody] AddTickerRequest request)
    {
        var (watchlist, error) = await _watchlistService.AddTickerToWatchlistAsync(watchlistId, userId, request);
        
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
    [HttpDelete("{userId:guid}/{watchlistId:guid}/tickers/{tickerId}")]
    public async Task<IActionResult> RemoveTicker(Guid userId, Guid watchlistId, string tickerId)
    {
        var (watchlist, error) = await _watchlistService.RemoveTickerFromWatchlistAsync(watchlistId, userId, tickerId);
        
        if (error != null)
        {
            if (error == "Watchlist not found")
                return NotFound(new { error });
            return BadRequest(new { error });
        }
        
        return Ok(watchlist);
    }
}