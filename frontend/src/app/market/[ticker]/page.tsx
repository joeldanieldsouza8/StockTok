"use client";

import { useEffect, useState } from "react";
// Simple client-side fallback for useParams so TS doesn't need 'next/navigation'
function useParams(): { ticker?: string } {
  const [params, setParams] = useState<{ ticker?: string }>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const parts = window.location.pathname.split("/").filter(Boolean);
    // assumes URL like /market/<ticker>
    const ticker = parts.length ? parts[parts.length - 1] : undefined;
    setParams({ ticker });
  }, []);

  return params;
}
import { getFundamentals, getHistory } from "@/services/marketService";
import { TickerFundamentalData, OHLCPoint } from "@/types/market";
import FundamentalsDisplay from "@/components/market/FundamentalsDisplay";
import StockChart from "@/components/market/StockChart"; // Import the new component

export default function MarketPage() {
  const params = useParams();
  const ticker = params.ticker as string;

  const [fundamentals, setFundamentals] =
    useState<TickerFundamentalData | null>(null);
  const [history, setHistory] = useState<OHLCPoint[]>([]); // New state for history
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!ticker) return;

      // 1. Fetch Fundamentals
      const fundData = await getFundamentals(ticker);
      setFundamentals(fundData);

      // 2. Fetch Chart History (Now active!)
      const historyData = await getHistory(ticker);
      setHistory(historyData);

      setLoading(false);
    }
    fetchData();
  }, [ticker]);

  if (loading)
    return <div className="p-10 text-white">Loading market data...</div>;
  if (!fundamentals)
    return <div className="p-10 text-red-500">Ticker not found.</div>;

  return (
    <main className="min-h-screen bg-black p-8">
      {/* 1. The Chart Section */}
      <div className="w-full bg-gray-900 rounded-lg mb-8 border border-gray-800 overflow-hidden">
        {history.length > 0 ? (
          <StockChart data={history} />
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            No chart data available
          </div>
        )}
      </div>

      {/* 2. The Fundamentals Section */}
      <FundamentalsDisplay data={fundamentals} />
    </main>
  );
}
