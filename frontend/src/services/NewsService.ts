import { NewsApiResponse, NewsArticle } from "../types/news";

const API_BASE_URL = "http://localhost:5214/api"; // Will need to add this to .env in the future

/**
 * Fetches news articles from the .NET Core API backend
 * @returns The News items
 */
export async function getNewsArticles(): Promise<NewsArticle[]> {
  const response = await fetch(`${API_BASE_URL}/news/from-database`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  const data: NewsApiResponse = await response.json();

  return data.data;
}
