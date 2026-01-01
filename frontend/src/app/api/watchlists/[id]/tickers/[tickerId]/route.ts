import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; tickerId: string }> }
) {
  try {
    const { token } = await auth0.getAccessToken();
    const { id, tickerId } = await params;

    const response = await fetch(
      `${API_BASE_URL}/api/watchlists/${id}/tickers/${tickerId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to remove ticker" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error removing ticker:", error);
    return NextResponse.json(
      { error: "Failed to remove ticker", details: error.message },
      { status: 500 }
    );
  }
}
