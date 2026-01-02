"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  CandlestickSeries,
} from "lightweight-charts";
import { OHLCPoint } from "@/types/market";

interface StockChartProps {
  data: OHLCPoint[];
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
}

export default function StockChart({ data, colors }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Initialize Chart
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current!.clientWidth,
        });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: colors?.backgroundColor || "#111827",
        }, // Gray-900
        textColor: colors?.textColor || "#D1D5DB",
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: "#374151" },
        horzLines: { color: "#374151" },
      },
    });

    chartRef.current = chart;

    // 2. Add Candlestick Series (Updated for v5+)
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    // --- FIX: Handle Data Safety & Capitalized Keys ---
    const validData = data
      // Filter out items that are completely empty
      .filter((item) => item !== null && item !== undefined)
      .map((item: any) => {
        // Handle both Python (Capitalized) and JS (lowercase) keys.
        // Python sends 'Date', 'Open'. JS might expect 'time', 'open'.
        const rawDate = item.Date || item.time;

        // Fix Date Format: If it looks like "2023-01-01T00:00:00", split it to just "2023-01-01"
        // Lightweight charts prefers the simple YYYY-MM-DD string for daily bars.
        let timeStr = rawDate;
        if (typeof rawDate === "string" && rawDate.includes("T")) {
          timeStr = rawDate.split("T")[0];
        }

        return {
          time: timeStr,
          open: item.Open || item.open,
          high: item.High || item.high,
          low: item.Low || item.low,
          close: item.Close || item.close,
        };
      })
      // Remove any items that still don't have a valid time after mapping
      .filter((item) => item.time)
      // Sort by date (Required by library)
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    if (validData.length > 0) {
      candlestickSeries.setData(validData);
    }
    // -------------------------------------------------

    // 4. Fit Content
    chart.timeScale().fitContent();

    // 5. Handle Resizing
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, colors]);

  return <div ref={chartContainerRef} className="w-full" />;
}
