"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
    createChart,
    ColorType,
    IChartApi,
    CandlestickSeries,
    ISeriesApi,
    CandlestickData,
    Time,
} from "lightweight-charts";
import { OHLCPoint } from "@/types/market";
import { getOlderHistory } from "@/services/market.service";
import { Loader2 } from "lucide-react";

interface StockChartProps {
    data: OHLCPoint[];
    ticker?: string;
}

function transformData(rawData: OHLCPoint[]): CandlestickData<Time>[] {
    return rawData
        .filter((item) => item !== null && item !== undefined)
        .map((item: any) => {
            const rawDate = item.Date || item.time;
            let timeStr = rawDate;
            if (typeof rawDate === "string" && rawDate.includes("T")) {
                timeStr = rawDate.split("T")[0];
            }
            return {
                time: timeStr as Time,
                open: item.Open || item.open,
                high: item.High || item.high,
                low: item.Low || item.low,
                close: item.Close || item.close,
            };
        })
        .filter((item) => item.time && item.open && item.high && item.low && item.close)
        .sort((a, b) => new Date(a.time as string).getTime() - new Date(b.time as string).getTime());
}

export default function StockChart({ data, ticker }: StockChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);

    const allDataRef = useRef<CandlestickData<Time>[]>([]);
    const earliestDateRef = useRef<number | null>(null);
    const loadCooldownRef = useRef<boolean>(false);

    const loadMoreData = useCallback(async () => {
        if (isLoadingMore || !hasMoreData || !earliestDateRef.current || !ticker || loadCooldownRef.current) {
            return;
        }

        setIsLoadingMore(true);
        loadCooldownRef.current = true;

        try {
            const olderData = await getOlderHistory(ticker, earliestDateRef.current);

            if (!olderData || olderData.length === 0) {
                setHasMoreData(false);
                return;
            }

            const transformedOlder = transformData(olderData);
            if (transformedOlder.length === 0) {
                setHasMoreData(false);
                return;
            }

            earliestDateRef.current = new Date(transformedOlder[0].time as string).getTime() / 1000;

            const existingTimes = new Set(allDataRef.current.map((d) => d.time));
            const uniqueOlder = transformedOlder.filter((d) => !existingTimes.has(d.time));
            const merged = [...uniqueOlder, ...allDataRef.current].sort(
                (a, b) => new Date(a.time as string).getTime() - new Date(b.time as string).getTime()
            );

            allDataRef.current = merged;

            if (seriesRef.current) {
                seriesRef.current.setData(merged);
            }
        } catch (err) {
            console.error("Failed to load more history:", err);
            setHasMoreData(false);
        } finally {
            setIsLoadingMore(false);
            setTimeout(() => {
                loadCooldownRef.current = false;
            }, 1000);
        }
    }, [isLoadingMore, hasMoreData, ticker]);

    // Create chart and load initial data together
    useEffect(() => {
        if (!chartContainerRef.current || !data || data.length === 0) return;

        // Clean up existing chart
        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
            seriesRef.current = null;
        }

        // Create chart with hex colors (oklch not supported by lightweight-charts)
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: "#1a1a2e" },
                textColor: "#9ca3af",
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            grid: {
                vertLines: { color: "#2d2d3d" },
                horzLines: { color: "#2d2d3d" },
            },
            rightPriceScale: {
                borderColor: "#2d2d3d",
            },
            timeScale: {
                borderColor: "#2d2d3d",
            },
        });

        const series = chart.addSeries(CandlestickSeries, {
            upColor: "#2dd4bf",
            downColor: "#ef4444",
            borderVisible: false,
            wickUpColor: "#2dd4bf",
            wickDownColor: "#ef4444",
        });

        chartRef.current = chart;
        seriesRef.current = series;

        // Transform and set initial data
        const transformed = transformData(data);
        if (transformed.length > 0) {
            allDataRef.current = transformed;
            earliestDateRef.current = new Date(transformed[0].time as string).getTime() / 1000;
            series.setData(transformed);
            chart.timeScale().fitContent();
        }

        // Cooldown to prevent immediate infinite scroll trigger
        loadCooldownRef.current = true;
        setTimeout(() => {
            loadCooldownRef.current = false;
        }, 1500);

        // Handle resize
        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
                seriesRef.current = null;
            }
        };
    }, [data]);

    // Set up scroll listener for infinite history
    useEffect(() => {
        if (!chartRef.current || !ticker) return;

        const onVisibleRangeChange = (logicalRange: { from: number; to: number } | null) => {
            if (
                logicalRange &&
                logicalRange.from < 10 &&
                !loadCooldownRef.current &&
                hasMoreData &&
                !isLoadingMore
            ) {
                loadMoreData();
            }
        };

        chartRef.current.timeScale().subscribeVisibleLogicalRangeChange(onVisibleRangeChange);

        return () => {
            if (chartRef.current) {
                chartRef.current.timeScale().unsubscribeVisibleLogicalRangeChange(onVisibleRangeChange);
            }
        };
    }, [ticker, loadMoreData, hasMoreData, isLoadingMore]);

    return (
        <div className="relative">
            <div ref={chartContainerRef} className="w-full" />

            {ticker && isLoadingMore && (
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-card/90 backdrop-blur text-muted-foreground text-xs px-3 py-1.5 rounded-full border border-border">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Loading more data...
                </div>
            )}

            {ticker && !hasMoreData && allDataRef.current.length > 0 && (
                <div className="absolute top-3 left-3 bg-card/90 backdrop-blur text-muted-foreground text-xs px-3 py-1.5 rounded-full border border-border">
                    No more history available
                </div>
            )}
        </div>
    );
}