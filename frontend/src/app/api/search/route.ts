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
            
            `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
                query
            )}&quotesCount=10&newsCount=3&listsCount=2&enableFuzzyQuery=true&quotesQueryId=tss_match_phrase_query&multiQuoteQueryId=multi_quote_single_token_query&newsQueryId=news_cie_vespa&enableCb=true&enableNavLinks=false&enableEnhancedTrivialQuery=true&enableResearchReports=false&enableCulturalAssets=true&enableLogoUrl=true&enableLists=false&recommendCount=5&enableCccBoost=true`,
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
            .filter((quote: any) =>
                quote.quoteType === "EQUITY" ||
                quote.quoteType === "ETF" ||
                quote.quoteType === "INDEX" ||
                quote.quoteType === "MUTUALFUND"
            )

        return NextResponse.json({ results });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 });
    }
}