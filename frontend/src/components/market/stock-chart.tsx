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

interface StockChartProps {
    data: OHLCPoint[];
    ticker?: string;
    colors?: {
        backgroundColor?: string;
        textColor?: string;
    };
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

export default function StockChart({ data, ticker, colors }: StockChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);

    // Use refs for data that shouldn't trigger re-renders
    const allDataRef = useRef<CandlestickData<Time>[]>([]);
    const earliestDateRef = useRef<number | null>(null);
    const loadCooldownRef = useRef<boolean>(false);
    const isInitializedRef = useRef<boolean>(false);

    // Load older history
    const loadMoreData = useCallback(async () => {
        // Multiple guards against repeated calls
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

            // Update earliest date reference
            earliestDateRef.current = new Date(transformedOlder[0].time as string).getTime() / 1000;

            // Merge data (deduplicated)
            const existingTimes = new Set(allDataRef.current.map((d) => d.time));
            const uniqueOlder = transformedOlder.filter((d) => !existingTimes.has(d.time));
            const merged = [...uniqueOlder, ...allDataRef.current].sort(
                (a, b) => new Date(a.time as string).getTime() - new Date(b.time as string).getTime()
            );

            allDataRef.current = merged;

            // Update series data WITHOUT recreating the chart
            if (seriesRef.current) {
                seriesRef.current.setData(merged);
            }
        } catch (err) {
            console.error("Failed to load more history:", err);
            setHasMoreData(false);
        } finally {
            setIsLoadingMore(false);
            // Cooldown period to prevent rapid consecutive loads
            setTimeout(() => {
                loadCooldownRef.current = false;
            }, 1000);
        }
    }, [isLoadingMore, hasMoreData, ticker]);

    // Initialize chart ONCE on mount
    useEffect(() => {
        if (!chartContainerRef.current || isInitializedRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: colors?.backgroundColor || "#111827" },
                textColor: colors?.textColor || "#D1D5DB",
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            grid: {
                vertLines: { color: "#374151" },
                horzLines: { color: "#374151" },
            },
        });

        const series = chart.addSeries(CandlestickSeries, {
            upColor: "#26a69a",
            downColor: "#ef5350",
            borderVisible: false,
            wickUpColor: "#26a69a",
            wickDownColor: "#ef5350",
        });

        chartRef.current = chart;
        seriesRef.current = series;
        isInitializedRef.current = true;

        // Handle resize
        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chart.remove();
            chartRef.current = null;
            seriesRef.current = null;
            isInitializedRef.current = false;
        };
    }, [colors]);

    // Set up scroll listener for infinite history (separate from chart creation)
    useEffect(() => {
        if (!chartRef.current || !ticker) return;

        const onVisibleRangeChange = (logicalRange: { from: number; to: number } | null) => {
            // Only load more if user has scrolled to see less than 10 bars on the left
            // AND we're not in cooldown AND we have more data to load
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

    // Load initial data from props
    useEffect(() => {
        if (!data || data.length === 0 || !seriesRef.current) return;

        const transformed = transformData(data);
        if (transformed.length === 0) return;

        // Only set initial data once, or if data prop completely changes
        if (allDataRef.current.length === 0) {
            allDataRef.current = transformed;
            earliestDateRef.current = new Date(transformed[0].time as string).getTime() / 1000;

            seriesRef.current.setData(transformed);
            chartRef.current?.timeScale().fitContent();

            // Start with cooldown active to prevent immediate loading
            loadCooldownRef.current = true;
            setTimeout(() => {
                loadCooldownRef.current = false;
            }, 1500);
        }
    }, [data]);

    return (
        <div className="relative">
            <div ref={chartContainerRef} className="w-full" />
            {ticker && isLoadingMore && (
                <div className="absolute top-2 left-2 bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                    Loading more data...
                </div>
            )}
            {ticker && !hasMoreData && allDataRef.current.length > 0 && (
                <div className="absolute top-2 left-2 bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded">
                    No more history available
                </div>
            )}
        </div>
    );
}