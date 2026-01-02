"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFundamentals, getHistory } from "@/services/market.service";
import { TickerFundamentalData, OHLCPoint } from "@/types/market";
import { FundamentalsDisplay, StockChart } from "@/components/market";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Loader2, AlertCircle } from "lucide-react";

function useParams(): { ticker?: string } {
    const [params, setParams] = useState<{ ticker?: string }>({});

    useEffect(() => {
        if (typeof window === "undefined") return;
        const parts = window.location.pathname.split("/").filter(Boolean);
        const ticker = parts.length ? parts[parts.length - 1] : undefined;
        setParams({ ticker });
    }, []);

    return params;
}

export default function TickerPage() {
    const params = useParams();
    const ticker = params.ticker as string;

    const [fundamentals, setFundamentals] = useState<TickerFundamentalData | null>(null);
    const [history, setHistory] = useState<OHLCPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Calculate price change
    const latestPrice = history.length > 0 ? history[history.length - 1]?.close : null;
    const previousPrice = history.length > 1 ? history[history.length - 2]?.close : null;
    const priceChange = latestPrice && previousPrice
        ? ((latestPrice - previousPrice) / previousPrice) * 100
        : null;

    useEffect(() => {
        async function fetchData() {
            if (!ticker) return;

            setLoading(true);
            setError(null);

            try {
                const [fundData, historyData] = await Promise.all([
                    getFundamentals(ticker),
                    getHistory(ticker),
                ]);

                if (!fundData) {
                    setError(`Ticker "${ticker}" not found`);
                } else {
                    setFundamentals(fundData);
                    setHistory(historyData);
                }
            } catch (err) {
                setError("Failed to load market data");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [ticker]);

    // Loading state
    if (loading) {
        return (
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Loading market data for {ticker}...</p>
                    </div>
                </div>
            </main>
        );
    }

    // Error state
    if (error || !fundamentals) {
        return (
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                        <h1 className="text-2xl font-bold">{error || "Ticker not found"}</h1>
                        <p className="text-muted-foreground">
                            We couldn't find any data for this symbol.
                        </p>
                        <Link href="/market">
                            <Button variant="outline" className="mt-4">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Markets
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/market"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back to Markets
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold">{ticker}</h1>
                                {fundamentals.sector && (
                                    <Badge variant="secondary">{fundamentals.sector}</Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground mt-1">
                                {fundamentals.companyName}
                            </p>
                        </div>

                        {/* Price Display */}
                        {latestPrice != null && (
                            <div className="text-right">
                                <div className="text-3xl font-bold">${latestPrice.toFixed(2)}</div>
                                {priceChange != null && (
                                    <div className={`flex items-center justify-end gap-1 text-sm font-medium ${
                                        priceChange >= 0 ? "text-success" : "text-destructive"
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
                    </div>
                </div>

                {/* Chart Section */}
                <Card className="mb-8 overflow-hidden">
                    {history.length > 0 ? (
                        <StockChart data={history} ticker={ticker} />
                    ) : (
                        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                            No chart data available
                        </div>
                    )}
                </Card>

                {/* Fundamentals Section */}
                <FundamentalsDisplay data={fundamentals} />
            </div>
        </main>
    );
}