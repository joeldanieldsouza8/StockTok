namespace User.Models;

public class WatchlistTicker
{
    public Guid WatchlistId { get; set; }
    
    public string TickerId { get; set; }
    
    public Watchlist Watchlist { get; set; }
    public Ticker Ticker { get; set; }
}