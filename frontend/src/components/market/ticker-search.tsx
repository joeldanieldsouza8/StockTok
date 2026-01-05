"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchResult {
    symbol: string;
    name: string;
    exchange: string;
    type: string;
}

interface TickerSearchProps {
    onSelect?: (symbol: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
    showTrending?: boolean;
}

const TRENDING_TICKERS: SearchResult[] = [
    { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", type: "EQUITY" },
    { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ", type: "EQUITY" },
    { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ", type: "EQUITY" },
    { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ", type: "EQUITY" },
    { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ", type: "EQUITY" },
    { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", type: "EQUITY" },
    { symbol: "META", name: "Meta Platforms Inc.", exchange: "NASDAQ", type: "EQUITY" },
    { symbol: "AMD", name: "Advanced Micro Devices", exchange: "NASDAQ", type: "EQUITY" },
];

export default function TickerSearch({
                                         onSelect,
                                         placeholder = "Search ticker or company...",
                                         autoFocus = false,
                                         showTrending = true,
                                     }: TickerSearchProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Debounced search
    useEffect(() => {
        if (query.length < 1) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.results || []);
            } catch (err) {
                console.error("Search error:", err);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (symbol: string) => {
        setQuery("");
        setResults([]);
        setIsFocused(false);
        if (onSelect) {
            onSelect(symbol);
        } else {
            router.push(`/market/${symbol}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const items = query.length > 0 ? results : (showTrending ? TRENDING_TICKERS : []);

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0 && items[selectedIndex]) {
                handleSelect(items[selectedIndex].symbol);
            } else if (query.length > 0) {
                // Try to navigate directly if user typed a ticker
                handleSelect(query.toUpperCase());
            }
        } else if (e.key === "Escape") {
            setIsFocused(false);
            inputRef.current?.blur();
        }
    };

    const showDropdown = isFocused && (query.length > 0 || showTrending);
    const displayItems = query.length > 0 ? results : (showTrending ? TRENDING_TICKERS : []);

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setSelectedIndex(-1);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    className="pl-10 pr-10 bg-secondary/50 border-border focus:border-primary focus:ring-primary"
                />
                {query.length > 0 && (
                    <button
                        onClick={() => {
                            setQuery("");
                            setResults([]);
                            inputRef.current?.focus();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                )}
            </div>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                    {query.length === 0 && showTrending && (
                        <div className="px-3 py-2 text-xs text-muted-foreground flex items-center gap-1 border-b border-border">
                            <TrendingUp className="h-3 w-3" />
                            Popular tickers
                        </div>
                    )}

                    {displayItems.length > 0 ? (
                        <ul className="max-h-80 overflow-y-auto">
                            {displayItems.map((item, index) => (
                                <li key={item.symbol}>
                                    <button
                                        onClick={() => handleSelect(item.symbol)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                                            selectedIndex === index
                                                ? "bg-primary/10 text-primary"
                                                : "hover:bg-secondary"
                                        }`}
                                    >
                                        <div>
                                            <span className="font-semibold">{item.symbol}</span>
                                            <span className="ml-2 text-sm text-muted-foreground truncate">
                        {item.name}
                      </span>
                                        </div>
                                        {item.exchange && (
                                            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {item.exchange}
                      </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : query.length > 0 && !isLoading ? (
                        <div className="px-4 py-8 text-center text-muted-foreground">
                            <p>No results found for "{query}"</p>
                            <p className="text-sm mt-1">Try searching for a ticker symbol or company name</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}