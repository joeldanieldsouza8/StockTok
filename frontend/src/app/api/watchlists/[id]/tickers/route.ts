import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { token } = await auth0.getAccessToken();
    const { id } = params;
    const body = await request.json();

    const response = await fetch(
      `${API_BASE_URL}/api/watchlists/${id}/tickers`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to add ticker" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error adding ticker:", error);
    return NextResponse.json(
      { error: "Failed to add ticker", details: error.message },
      { status: 500 }
    );
  }
}
