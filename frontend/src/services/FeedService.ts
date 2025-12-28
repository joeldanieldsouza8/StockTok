import { getNewsArticles } from "./NewsService";
import { FeedItem } from "../types/feed";

/**
 * Fetches news articles (and eventually user posts), groups them by stock ticker, 
 * and returns a list containing the latest item for each unique stock.
 * @returns A promise that resolves to an array of FeedItems, with one item per ticker.
 */
export async function getFeedByTicker(): Promise<FeedItem[]> {
  try {
    // Fetch Data for feed
    const [newsArticles] = await Promise.all([ // Promise.all fetches multiple data sources in parallel
      getNewsArticles().catch((err) => {
        console.error("DEBUG: Fetch failed details:", err); 
        return [];
      }),
    ]);
    
    // Normalise the raw API response into a unified FeedItem structure
    const newsItems: FeedItem[] = newsArticles.map((article) => ({
      type: "news" as const,
      data: article,
    }));

    // (For later)
    //
    // const postItems: FeedItem[] = userPosts.map(post => ({
    // type: 'post' as const,
    // data: post
    // }));

    // Structure the items such that keys are tickers containing news and post items about associated tickers
    const groupedByTicker = groupItemsByTicker(newsItems);

    // Convert the Dictionary into a single list of FeedItems, sorted then having the top item selected per ticker per news and user post
    return alternateByTicker(groupedByTicker);
  } catch (error) {
    console.error("Failed to fetch feed:", error);
    return [];
  }

  /**
   * Groups a list of FeedItems into a Dictionary keyed by the ticker.
   * @param newsItems 
   * @returns a grouped list of News and Social Posts by ticker.
   */
  function groupItemsByTicker(
    newsItems: FeedItem[]
    //      ,postItems: FeedItem[]
  ): Map<
    string,
    {
      news: FeedItem[];
      //posts: FeedItem[]
    }
  > {
    const tickerMap = new Map<string, { news: FeedItem[] }>(); //posts: FeedItem[]

    newsItems.forEach((item) => {
      if (
        item.type === "news" &&
        item.data.newsArticleEntities &&
        item.data.newsArticleEntities.length > 0
      ) {
        const ticker = item.data.newsArticleEntities[0].symbol;

        if (!tickerMap.has(ticker)) {
          tickerMap.set(ticker, {
            news: [], //, posts: []
          });
        }

        tickerMap.get(ticker)!.news.push(item);
      }
    });
    // postItems.forEach((item) => {
    //     if (item.type === "post" && item.data.ticker) {
    //     const ticker = item.data.ticker;

    //     if (!tickerMap.has(ticker)) {
    //         tickerMap.set(ticker, { news: [], posts: [] });
    //     }

    //     tickerMap.get(ticker)!.posts.push(item);
    //     }
    // });
    return tickerMap;
  }

  /**
   * Converts the grouped dictionary into a list.
   * @param tickerMap 
   * @returns An alternating list of the first News and Social Post of each ticker found in tickerMap.
   */
  function alternateByTicker(
    tickerMap: Map<string, { news: FeedItem[] }>
  ): FeedItem[] {
    const result: FeedItem[] = [];

    const sortedTickers = Array.from(tickerMap.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    sortedTickers.forEach(([ticker, items]) => {
      if (items.news.length > 0) {
        result.push(items.news[0]);
      }
    });

    return result;
  }
}
