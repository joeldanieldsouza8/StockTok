import { TickerFundamentalData, OHLCPoint } from "@/src/types/market";

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