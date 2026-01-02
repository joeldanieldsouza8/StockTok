import { NewsArticle } from "lib/types/news-item";

const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return "";  // Client-side: relative URLs work
    }
    // Server-side: need absolute URL
    return process.env.APP_BASE_URL || "http://localhost:3000";
};

export async function getNewsBySymbol(symbol: string): Promise<NewsArticle[]> {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/news/${symbol}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
    }

    return response.json();
}