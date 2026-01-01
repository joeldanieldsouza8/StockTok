"use client";

import { useEffect, useRef, useState } from "react";
import {
    createChart,
    ColorType,
    IChartApi,
    AreaSeries,
    ISeriesApi,
} from "lightweight-charts";

interface ChartDataPoint {
    time?: string;
    Date?: string;
    close?: number;
    Close?: number;
}

interface StockLineChartProps {
    data: ChartDataPoint[];
    symbol?: string;
    height?: number;
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        topColor?: string;
        bottomColor?: string;
        textColor?: string;
    };
}

export default function StockLineChart({
                                           data,
                                           symbol,
                                           height = 200,
                                           colors,
                                       }: StockLineChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
    const [legendValue, setLegendValue] = useState<string>("");

    // Default colors - teal/cyan theme on dark background
    const chartColors = {
        backgroundColor: colors?.backgroundColor || "#111827",
        lineColor: colors?.lineColor || "#2dd4bf",
        topColor: colors?.topColor || "rgba(45, 212, 191, 0.4)",
        bottomColor: colors?.bottomColor || "rgba(45, 212, 191, 0.05)",
        textColor: colors?.textColor || "#9CA3AF",
    };

    useEffect(() => {
        if (!chartContainerRef.current || !data || data.length === 0) return;

        // Cleanup previous chart
        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
            seriesRef.current = null;
        }

        // Create chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: chartColors.backgroundColor },
                textColor: chartColors.textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: height,
            rightPriceScale: {
                scaleMargins: {
                    top: 0.35,
                    bottom: 0.15,
                },
                borderVisible: false,
            },
            leftPriceScale: {
                visible: false,
            },
            timeScale: {
                borderVisible: false,
                timeVisible: false,
            },
            crosshair: {
                horzLine: {
                    visible: false,
                    labelVisible: false,
                },
                vertLine: {
                    labelVisible: false,
                },
            },
            grid: {
                vertLines: { visible: false },
                horzLines: { visible: false },
            },
            handleScroll: false,
            handleScale: false,
        });

        chartRef.current = chart;

        // Add area series
        const areaSeries = chart.addSeries(AreaSeries, {
            topColor: chartColors.topColor,
            bottomColor: chartColors.bottomColor,
            lineColor: chartColors.lineColor,
            lineWidth: 2,
            crosshairMarkerVisible: true,
            crosshairMarkerRadius: 4,
            crosshairMarkerBorderColor: chartColors.lineColor,
            crosshairMarkerBackgroundColor: chartColors.backgroundColor,
        });

        seriesRef.current = areaSeries;

        // Transform data to line format (using close price)
        const lineData = data
            .filter((item) => item != null)
            .map((item) => {
                const rawDate = item.Date || item.time;
                let timeStr = rawDate;
                if (typeof rawDate === "string" && rawDate.includes("T")) {
                    timeStr = rawDate.split("T")[0];
                }
                const closePrice = item.Close ?? item.close;
                return {
                    time: timeStr as string,
                    value: closePrice,
                };
            })
            .filter((item) => item.time && item.value != null)
            .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

        if (lineData.length > 0) {
            areaSeries.setData(lineData);
            const latestValue = lineData[lineData.length - 1].value;
            if (latestValue != null) {
                setLegendValue(latestValue.toFixed(2));
            }
        }

        // Subscribe to crosshair move for legend updates
        chart.subscribeCrosshairMove((param) => {
            if (param.time) {
                const dataPoint = param.seriesData.get(areaSeries);
                if (dataPoint) {
                    const price = (dataPoint as { value?: number }).value;
                    if (price != null) {
                        setLegendValue(price.toFixed(2));
                    }
                }
            } else if (lineData.length > 0) {
                const latestValue = lineData[lineData.length - 1].value;
                if (latestValue != null) {
                    setLegendValue(latestValue.toFixed(2));
                }
            }
        });

        chart.timeScale().fitContent();

        // Handle resize
        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
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
    }, [data, height, chartColors.backgroundColor, chartColors.lineColor, chartColors.topColor, chartColors.bottomColor, chartColors.textColor]);

    return (
        <div className="relative">
            {symbol && (
                <div
                    className="absolute left-3 top-3 z-10 font-sans text-sm"
                    style={{ color: chartColors.textColor }}
                >
                    <span className="text-gray-400">{symbol}</span>
                    {legendValue && (
                        <span
                            className="ml-2 font-semibold"
                            style={{ color: chartColors.lineColor }}
                        >
              ${legendValue}
            </span>
                    )}
                </div>
            )}
            <div ref={chartContainerRef} className="w-full" />
        </div>
    );
}