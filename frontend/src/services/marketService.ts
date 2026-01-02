import { TickerFundamentalData, OHLCPoint } from "@/types/market";

// The gateway URL to the FastAPI backend
function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Client-side (Browser): Use localhost or public URL
    return "http://localhost:5069";
  }

  // Server-side (Docker): Use the internal Gateway address
  // This must match the service name 'api-gateway' and internal port '8080'
  return process.env.BACKEND_API_URL || "http://api-gateway:8080";
}

const baseUrl = getBaseUrl();

// function to get fundamental data for a given ticker
export async function getFundamentals(ticker: string): Promise<TickerFundamentalData | null> {
  try {
    // Matches your FastAPI route: /api/market/ticker/{ticker}/fundamentals
    const res = await fetch(`${baseUrl}/api/market/ticker/${ticker}/fundamentals`);
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
    const res = await fetch(`${baseUrl}/api/market/ticker/${ticker}/history/`);
    if (!res.ok) throw new Error("Failed to fetch history");
    const data = await res.json();
    return data.history; 
  } catch (error) {
    console.error(error);
    return [];
  }
}