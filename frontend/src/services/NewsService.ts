import { NewsApiResponse, NewsArticle } from "../types/news";
import { WatchlistTicker } from "../types/watchlist";

const GATEWAY_URL = "http://localhost:5069/api";

/**
 * Fetches news articles from the .NET Core API backend
 * @returns The News items
 */
export async function getNewsArticlesByTickers(
  tickers: WatchlistTicker[]
): Promise<NewsArticle[]> {
  const formattedTickers = tickers
    .map((t) => t.id)
    .map((id) => encodeURIComponent(id)) // Safety for symbols with spaces or special chars
    .join(",");

  const response = await fetch(
    `${GATEWAY_URL}/News?symbols=${formattedTickers}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  const data: NewsApiResponse = await response.json();

  return data;
}
