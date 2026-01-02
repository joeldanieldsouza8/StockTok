"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StockChart from "@/components/market/stock-chart";
import { getHistory } from "@/services/market.service";
import { OHLCPoint } from "@/types/market";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TopTickerChartProps {
  tickerId: string;
  stockName: string;
  count: number;
}

export function TopTickerChart({ tickerId, stockName, count }: TopTickerChartProps) {
  const [chartData, setChartData] = useState<OHLCPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceChange, setPriceChange] = useState<number | null>(null);

  useEffect(() => {
    loadChartData();
  }, [tickerId]);

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      const history = await getHistory(tickerId);
      setChartData(history);

      // Calculate price change percentage
      if (history.length >= 2) {
        const latestClose = history[history.length - 1]?.close;
        const previousClose = history[history.length - 2]?.close;
        
        if (latestClose && previousClose) {
          const change = ((latestClose - previousClose) / previousClose) * 100;
          setPriceChange(change);
        }
      }
    } catch (error) {
      console.error(`Failed to load chart data for ${tickerId}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const latestPrice = chartData.length > 0 
    ? chartData[chartData.length - 1]?.close
    : null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{tickerId}</CardTitle>
            <p className="text-sm text-muted-foreground truncate">
              {stockName}
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {count} {count === 1 ? "list" : "lists"}
          </Badge>
        </div>
        
        {/* Price and Change */}
        {latestPrice !== null && (
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold">
              ${latestPrice}
            </span>
            {priceChange !== null && (
              <div className={`flex items-center gap-1 text-sm font-medium ${
                priceChange >= 0 ? "text-green-500" : "text-red-500"
              }`}>
                {priceChange >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>
                  {priceChange >= 0 ? "+" : ""}
                  {priceChange.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-xs text-muted-foreground">Loading chart...</p>
            </div>
          </div>
        ) : chartData.length > 0 ? (
          <div className="bg-gray-900/50">
            <StockChart 
              data={chartData}
              colors={{
                backgroundColor: "#111827",
                textColor: "#9CA3AF",
              }}
            />
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center bg-muted/20">
            <p className="text-sm text-muted-foreground">No chart data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
