import { NewsApiResponse, NewsArticle } from "../types/news";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return ""; // Use relative path for client-side to avoid CORS
  }
  return process.env.BACKEND_API_URL || "http://api-gateway:8080";
}

function getHeaders(accessToken?: string) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return headers;
}

export async function getNewsArticlesByTickers(
  tickers: string | string[],
  accessToken?: string
): Promise<NewsArticle[]> {
  const symbols = Array.isArray(tickers) ? tickers : [tickers];

  if (symbols.length === 0) return [];

  const formattedTickers = symbols.map((s) => encodeURIComponent(s)).join(",");
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/news?symbols=${formattedTickers}`;

  const response = await fetch(url, {
    headers: getHeaders(accessToken),
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.warn("[NewsService] Unauthorized. User might not be logged in.");
      return []; // Return empty instead of crashing
    }
    const errorText = await response.text();
    console.error(`[NewsService] Failed: ${response.status} - ${errorText}`);
    throw new Error(`Failed to fetch news: ${response.status}`);
  }

  const data: NewsApiResponse = await response.json();
  return data;
}
