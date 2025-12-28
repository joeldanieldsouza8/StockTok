// Watchlist related types matching backend DTOs

export interface Ticker {
  id: string; // Stock symbol like "AAPL", "GOOGL"
  stockName: string; // Company name
}

export interface TickerResponse {
  id: string;
  stockName: string;
}

export interface WatchlistResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  tickers: TickerResponse[];
}

export interface TopTickersResponse {
  id: string;
  stockName: string;
  count: number; // How many watchlists contain this ticker
}

// Request DTOs
export interface CreateWatchlistRequest {
  name: string;
}

export interface UpdateWatchlistRequest {
  name: string;
}

export interface AddTickerRequest {
  tickerId: string; // Stock symbol
  stockName: string; // Company name
}
