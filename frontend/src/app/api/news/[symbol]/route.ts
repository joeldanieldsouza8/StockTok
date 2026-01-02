import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ symbol: string }> }
) {
    try {
        const { symbol } = await params;
        const { token } = await auth0.getAccessToken();
        const apiBaseUrl = process.env.BACKEND_API_URL || "http://api-gateway:8080";

        const response = await fetch(`${apiBaseUrl}/api/news/${symbol}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch news: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("News API error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}