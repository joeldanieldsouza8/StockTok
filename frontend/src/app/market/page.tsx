"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Zap, Building2, Cpu, Heart, Car, Landmark, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import TickerSearch from "@/components/market/ticker-search";

// Curated ticker lists by category
const MARKET_CATEGORIES = [
    {
        name: "Trending",
        icon: Flame,
        tickers: [
            { symbol: "NVDA", name: "NVIDIA Corporation" },
            { symbol: "TSLA", name: "Tesla Inc." },
            { symbol: "AMD", name: "Advanced Micro Devices" },
            { symbol: "PLTR", name: "Palantir Technologies" },
            { symbol: "SMCI", name: "Super Micro Computer" },
            { symbol: "ARM", name: "Arm Holdings" },
        ],
    },
    {
        name: "Tech Giants",
        icon: Cpu,
        tickers: [
            { symbol: "AAPL", name: "Apple Inc." },
            { symbol: "MSFT", name: "Microsoft Corporation" },
            { symbol: "GOOGL", name: "Alphabet Inc." },
            { symbol: "AMZN", name: "Amazon.com Inc." },
            { symbol: "META", name: "Meta Platforms Inc." },
            { symbol: "NFLX", name: "Netflix Inc." },
        ],
    },
    {
        name: "Finance",
        icon: Landmark,
        tickers: [
            { symbol: "JPM", name: "JPMorgan Chase & Co." },
            { symbol: "BAC", name: "Bank of America Corp." },
            { symbol: "GS", name: "Goldman Sachs Group" },
            { symbol: "V", name: "Visa Inc." },
            { symbol: "MA", name: "Mastercard Inc." },
            { symbol: "BRK-B", name: "Berkshire Hathaway" },
        ],
    },
    {
        name: "Healthcare",
        icon: Heart,
        tickers: [
            { symbol: "JNJ", name: "Johnson & Johnson" },
            { symbol: "UNH", name: "UnitedHealth Group" },
            { symbol: "PFE", name: "Pfizer Inc." },
            { symbol: "ABBV", name: "AbbVie Inc." },
            { symbol: "MRK", name: "Merck & Co." },
            { symbol: "LLY", name: "Eli Lilly and Co." },
        ],
    },
    {
        name: "Automotive",
        icon: Car,
        tickers: [
            { symbol: "TSLA", name: "Tesla Inc." },
            { symbol: "F", name: "Ford Motor Company" },
            { symbol: "GM", name: "General Motors Co." },
            { symbol: "RIVN", name: "Rivian Automotive" },
            { symbol: "LCID", name: "Lucid Group Inc." },
            { symbol: "NIO", name: "NIO Inc." },
        ],
    },
    {
        name: "Energy",
        icon: Zap,
        tickers: [
            { symbol: "XOM", name: "Exxon Mobil Corp." },
            { symbol: "CVX", name: "Chevron Corporation" },
            { symbol: "COP", name: "ConocoPhillips" },
            { symbol: "NEE", name: "NextEra Energy" },
            { symbol: "ENPH", name: "Enphase Energy" },
            { symbol: "FSLR", name: "First Solar Inc." },
        ],
    },
];

const MARKET_INDICES = [
    { symbol: "^GSPC", name: "S&P 500", displaySymbol: "SPX" },
    { symbol: "^DJI", name: "Dow Jones", displaySymbol: "DJI" },
    { symbol: "^IXIC", name: "NASDAQ", displaySymbol: "IXIC" },
    { symbol: "^RUT", name: "Russell 2000", displaySymbol: "RUT" },
];

export default function MarketsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Markets</h1>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                        Search thousands of stocks, ETFs, and indices. Get real-time quotes, charts, and fundamentals.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl">
                        <TickerSearch
                            placeholder="Search ticker or company name..."
                            autoFocus
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Market Indices */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Market Indices
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {MARKET_INDICES.map((index) => (
                            <Link key={index.symbol} href={`/market/${encodeURIComponent(index.symbol)}`}>
                                <Card className="p-4 hover:border-primary/50 transition-all cursor-pointer group">
                                    <div className="text-xs text-muted-foreground mb-1">{index.displaySymbol}</div>
                                    <div className="font-semibold group-hover:text-primary transition-colors">
                                        {index.name}
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Category Pills */}
                <section className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedCategory === null
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                            }`}
                        >
                            All
                        </button>
                        {MARKET_CATEGORIES.map((category) => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={category.name}
                                    onClick={() => setSelectedCategory(category.name)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                                        selectedCategory === category.name
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary hover:bg-secondary/80 text-foreground"
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {category.name}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Ticker Grid */}
                <section>
                    {MARKET_CATEGORIES.filter(
                        (cat) => selectedCategory === null || cat.name === selectedCategory
                    ).map((category) => {
                        const Icon = category.icon;
                        return (
                            <div key={category.name} className="mb-10">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Icon className="h-5 w-5 text-primary" />
                                    {category.name}
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {category.tickers.map((ticker) => (
                                        <Link key={ticker.symbol} href={`/market/${ticker.symbol}`}>
                                            <Card className="p-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group h-full">
                                                <div className="font-bold text-lg group-hover:text-primary transition-colors">
                                                    {ticker.symbol}
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate mt-1">
                                                    {ticker.name}
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </section>

                {/* Direct Ticker Input */}
                <section className="mt-12 mb-8">
                    <Card className="p-6 bg-secondary/30 border-dashed">
                        <h3 className="font-semibold mb-2">Can't find what you're looking for?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Enter any valid ticker symbol directly in the search bar above. We support thousands of stocks, ETFs, and indices from major exchanges.
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span className="bg-secondary px-2 py-1 rounded">NYSE</span>
                            <span className="bg-secondary px-2 py-1 rounded">NASDAQ</span>
                            <span className="bg-secondary px-2 py-1 rounded">AMEX</span>
                            <span className="bg-secondary px-2 py-1 rounded">LSE</span>
                            <span className="bg-secondary px-2 py-1 rounded">TSX</span>
                            <span className="bg-secondary px-2 py-1 rounded">And more...</span>
                        </div>
                    </Card>
                </section>
            </div>
        </main>
    );
}