import {
  WatchlistResponse,
  CreateWatchlistRequest,
  UpdateWatchlistRequest,
  AddTickerRequest,
  TopTickersResponse,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5069";

export const watchlistService = {
  /**
   * Get all watchlists for the authenticated user
   */
  async getWatchlists(): Promise<WatchlistResponse[]> {
    try {
      const res = await fetch("/api/watchlists");
      
      if (!res.ok) {
        throw new Error(`Failed to fetch watchlists: ${res.statusText}`);
      }
      
      return await res.json();
    } catch (error) {
      console.error("Error fetching watchlists:", error);
      throw error;
    }
  },

  /**
   * Get a specific watchlist by ID
   */
  async getWatchlist(id: string): Promise<WatchlistResponse> {
    try {
      const res = await fetch(`/api/watchlists/${id}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch watchlist: ${res.statusText}`);
      }
      
      return await res.json();
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      throw error;
    }
  },

  /**
   * Get top N tickers across all user's watchlists
   */
  async getTopTickers(count: number = 3): Promise<TopTickersResponse[]> {
    try {
      const res = await fetch(`/api/watchlists/top-tickers?count=${count}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch top tickers: ${res.statusText}`);
      }
      
      return await res.json();
    } catch (error) {
      console.error("Error fetching top tickers:", error);
      throw error;
    }
  },

  /**
   * Create a new watchlist
   */
  async createWatchlist(
    data: CreateWatchlistRequest
  ): Promise<WatchlistResponse> {
    try {
      const res = await fetch("/api/watchlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `Failed to create watchlist: ${res.statusText}`);
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
    data: UpdateWatchlistRequest
  ): Promise<WatchlistResponse> {
    try {
      const res = await fetch(`/api/watchlists/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `Failed to update watchlist: ${res.statusText}`);
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
  async deleteWatchlist(id: string): Promise<void> {
    try {
      const res = await fetch(`/api/watchlists/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `Failed to delete watchlist: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting watchlist:", error);
      throw error;
    }
  },

  /**
   * Add a ticker to a watchlist
   */
  async addTicker(
    watchlistId: string,
    data: AddTickerRequest
  ): Promise<WatchlistResponse> {
    try {
      const res = await fetch(`/api/watchlists/${watchlistId}/tickers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `Failed to add ticker: ${res.statusText}`);
      }
      
      return await res.json();
    } catch (error) {
      console.error("Error adding ticker:", error);
      throw error;
    }
  },

  /**
   * Remove a ticker from a watchlist
   */
  async removeTicker(
    watchlistId: string,
    tickerId: string
  ): Promise<WatchlistResponse> {
    try {
      const res = await fetch(`/api/watchlists/${watchlistId}/tickers/${tickerId}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `Failed to remove ticker: ${res.statusText}`);
      }
      
      return await res.json();
    } catch (error) {
      console.error("Error removing ticker:", error);
      throw error;
    }
  },
};
