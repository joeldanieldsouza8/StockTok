namespace User.Models;

public class Ticker
{
    ///<summary>
    /// The ticker symbol -> Used as primary keys
    ///</summary>
    public string Id {get; set;}
    
    ///<summary>
    /// Full company/stock name.
    ///</summary>
    /// <example>Apple Inc.</example>
    public string StockName { get; set; }
    // property for many to many relationship
    public ICollection<WatchlistTicker> WatchlistTickers { get; set; } = new List<WatchlistTicker>();
}