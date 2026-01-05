import { TickerFundamentalData, OHLCPoint } from "@/types/market";

// The gateway URL to the FastAPI backend
const GATEWAY_URL = "http://localhost:5069"; 

// function to get fundamental data for a given ticker
export async function getFundamentals(ticker: string): Promise<TickerFundamentalData | null> {
  try {
    // Matches your FastAPI route: /api/market/ticker/{ticker}/fundamentals
    const res = await fetch(`${GATEWAY_URL}/api/market/ticker/${ticker}/fundamentals`);
    if (!res.ok) throw new Error("Failed to fetch fundamentals");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
// function to get historical OHLC data for a given ticker
export async function getHistory(ticker: string): Promise<OHLCPoint[]> {
  try {
    const res = await fetch(`${GATEWAY_URL}/api/market/ticker/${ticker}/history/`);
    if (!res.ok) throw new Error("Failed to fetch history");
    const data = await res.json();
    return data.history; 
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Fetch older history before a given timestamp (for infinite scroll)
// earliestTimestamp: Unix timestamp (seconds) of the oldest bar currently displayed
export async function getOlderHistory(ticker: string, earliestTimestamp: number): Promise<OHLCPoint[]> {
    try {
        // Round to integer to ensure clean URL
        const epochTime = Math.floor(earliestTimestamp);
        const res = await fetch(`${GATEWAY_URL}/api/market/history/${ticker}/${epochTime}`);

        if (res.status === 404) {
            // No more data available
            return [];
        }
        if (!res.ok) throw new Error("Failed to fetch older history");

        const data = await res.json();
        // Handle both array response and object with history key
        return Array.isArray(data) ? data : data.history || [];
    } catch (error) {
        console.error("Error fetching older history:", error);
        return [];
    }
}