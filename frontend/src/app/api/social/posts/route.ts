import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

const getApiBaseUrl = () => process.env.BACKEND_API_URL || "http://api-gateway:8080";

export async function GET() {
    try {
        const { token } = await auth0.getAccessToken();

        const response = await fetch(`${getApiBaseUrl()}/api/posts`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch posts: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Posts API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { token } = await auth0.getAccessToken();
        const body = await request.json();

        const response = await fetch(`${getApiBaseUrl()}/api/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to create post: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        console.error("Create post error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}