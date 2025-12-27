import {
  Watchlist,
  WatchlistApiResponse,
  WatchlistTicker,
} from "../types/watchlist";

const GATEWAY_URL = "http://localhost:5069/api";

/**
 * Fetches logged-in users' stock ticker watchlists from the .NET Core API backend
 * @returns The watchlist items
 */
export async function getWatchlists(): Promise<Watchlist[]> {
  const response = await fetch(`${GATEWAY_URL}/watchlists/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch watchlists");
  }

  const data: WatchlistApiResponse = await response.json();

  return data.data;
}

/**
 * Fetches top n tickers from users' watchlists
 * @param count The top n tickers to retrieve
 * @returns The top n tickers
 */
export async function getTopTickers(count: number): Promise<WatchlistTicker[]> {
  const response = await fetch(
    `${GATEWAY_URL}/watchlists/top-tickers?count=${count.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch watchlists");
  }

  return response.json();
}
