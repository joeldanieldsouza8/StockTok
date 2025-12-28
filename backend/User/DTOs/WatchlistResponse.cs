namespace User.DTOs.Watchlist;

public class WatchlistResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public List<TickerResponse> Tickers { get; set; } = new();
}

public class TickerResponse
{
    public string Id {get; set; } // Ticker symbol -> 'AAPL' or 'NVDA' etc.
    public string StockName { get; set; }   
}