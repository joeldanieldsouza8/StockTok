import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET() {
  try {
    const { token } = await auth0.getAccessToken();

    const response = await fetch(`${API_BASE_URL}/api/watchlists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to fetch watchlists" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching watchlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlists", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { token } = await auth0.getAccessToken();
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/watchlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to create watchlist" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Error creating watchlist:", error);
    return NextResponse.json(
      { error: "Failed to create watchlist", details: error.message },
      { status: 500 }
    );
  }
}
