import { NextRequest, NextResponse } from "next/server";

export interface SearchResult {
    symbol: string;
    name: string;
    exchange: string;
    type: string;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.length < 1) {
        return NextResponse.json({ results: [] });
    }

    try {
        // Yahoo Finance search API (undocumented but reliable)
        const response = await fetch(
            `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
                query
            )}&quotesCount=10&newsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query`,
            {
                headers: {
                    "User-Agent": "Mozilla/5.0",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Yahoo Finance API error");
        }

        const data = await response.json();

        // Transform the response to our format
        const results: SearchResult[] = (data.quotes || [])
            .filter((quote: any) => quote.quoteType === "EQUITY" || quote.quoteType === "ETF")
            .map((quote: any) => ({
                symbol: quote.symbol,
                name: quote.shortname || quote.longname || quote.symbol,
                exchange: quote.exchange || "",
                type: quote.quoteType || "EQUITY",
            }));

        return NextResponse.json({ results });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 });
    }
}