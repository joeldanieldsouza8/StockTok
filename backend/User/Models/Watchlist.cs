namespace User.Models;

public class Watchlist
{
    public Guid Id { get; set; }
    
    /// <summary>
    /// Foreign key to the user of this watchlist.
    /// </summary>
    public Guid UserId { get; set; }
    
    /// <summary>
    /// The name of the watchlist.
    /// </summary>
    /// <example>Tech Stocks</example>
    public string Name { get; set; }
    
    public DateTimeOffset CreatedAt { get; set; }
    
    public DateTimeOffset UpdatedAt { get; set; }
    
    // Navigation properties
    public User User { get; set; }
    public ICollection<WatchlistTicker> WatchlistTickers { get; set; } = new List<WatchlistTicker>();
}