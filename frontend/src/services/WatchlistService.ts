import {
  WatchlistResponse,
  CreateWatchlistRequest,
  UpdateWatchlistRequest,
  AddTickerRequest,
  TopTickersResponse,
} from "@/types";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Client-side: Return empty string to use relative path (proxy via Next.js API)
    return "";
  }
  // Server-side: Use direct Docker network URL
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

const baseUrl = getBaseUrl();

export const watchlistService = {
  /**
   * Get all watchlists
   */
  async getWatchlists(accessToken?: string): Promise<WatchlistResponse[]> {
    try {
      const res = await fetch(`${baseUrl}/api/watchlists`, {
        headers: getHeaders(accessToken),
        cache: "no-store",
      });

      if (!res.ok)
        throw new Error(`Failed to fetch watchlists: ${res.statusText}`);
      return await res.json();
    } catch (error) {
      console.error("Error fetching watchlists:", error);
      throw error;
    }
  },

  /**
   * Get a specific watchlist
   */
  async getWatchlist(
    id: string,
    accessToken?: string
  ): Promise<WatchlistResponse> {
    try {
      const res = await fetch(`${baseUrl}/api/watchlists/${id}`, {
        headers: getHeaders(accessToken),
      });

      if (!res.ok)
        throw new Error(`Failed to fetch watchlist: ${res.statusText}`);
      return await res.json();
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      throw error;
    }
  },

  /**
   * Get top N tickers
   */
  async getTopTickers(
    count: number = 3,
    accessToken?: string
  ): Promise<TopTickersResponse[]> {
    try {
      const res = await fetch(
        `${baseUrl}/api/watchlists/top-tickers?count=${count}`,
        {
          headers: getHeaders(accessToken),
          next: { revalidate: 60 }, // Optional caching
        }
      );

      if (!res.ok) {
        // Graceful fallback for 401
        if (res.status === 401) return [];
        throw new Error(`Failed to fetch top tickers: ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error("Error fetching top tickers:", error);
      // Return empty array to avoid crashing UI
      return [];
    }
  },

  /**
   * Create a new watchlist
   */
  async createWatchlist(
    data: CreateWatchlistRequest,
    accessToken?: string
  ): Promise<WatchlistResponse> {
    try {
      const res = await fetch(`${baseUrl}/api/watchlists`, {
        method: "POST",
        headers: getHeaders(accessToken),
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          error.error || `Failed to create watchlist: ${res.statusText}`
        );
      }
      return await res.json();
    } catch (error) {
      console.error("Error creating watchlist:", error);
      throw error;
    }
  },

  /**
   * Update a watchlist's name
   */
  async updateWatchlist(
    id: string,
    data: UpdateWatchlistRequest,
    accessToken?: string
  ): Promise<WatchlistResponse> {
    try {
      const res = await fetch(`${baseUrl}/api/watchlists/${id}`, {
        method: "PUT",
        headers: getHeaders(accessToken),
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          error.error || `Failed to update watchlist: ${res.statusText}`
        );
      }
      return await res.json();
    } catch (error) {
      console.error("Error updating watchlist:", error);
      throw error;
    }
  },

  /**
   * Delete a watchlist
   */
  async deleteWatchlist(id: string, accessToken?: string): Promise<void> {
    try {
      const res = await fetch(`${baseUrl}/api/watchlists/${id}`, {
        method: "DELETE",
        headers: getHeaders(accessToken),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          error.error || `Failed to delete watchlist: ${res.statusText}`
        );
      }
    } catch (error) {
      console.error("Error deleting watchlist:", error);
      throw error;
    }
  },

  /**
   * Add a ticker
   */
  async addTicker(
    watchlistId: string,
    data: AddTickerRequest,
    accessToken?: string
  ): Promise<WatchlistResponse> {
    try {
      const res = await fetch(
        `${baseUrl}/api/watchlists/${watchlistId}/tickers`,
        {
          method: "POST",
          headers: getHeaders(accessToken),
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          error.error || `Failed to add ticker: ${res.statusText}`
        );
      }
      return await res.json();
    } catch (error) {
      console.error("Error adding ticker:", error);
      throw error;
    }
  },

  /**
   * Remove a ticker
   */
  async removeTicker(
    watchlistId: string,
    tickerId: string,
    accessToken?: string
  ): Promise<WatchlistResponse> {
    try {
      const res = await fetch(
        `${baseUrl}/api/watchlists/${watchlistId}/tickers/${tickerId}`,
        {
          method: "DELETE",
          headers: getHeaders(accessToken),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          error.error || `Failed to remove ticker: ${res.statusText}`
        );
      }
      return await res.json();
    } catch (error) {
      console.error("Error removing ticker:", error);
      throw error;
    }
  },
};
