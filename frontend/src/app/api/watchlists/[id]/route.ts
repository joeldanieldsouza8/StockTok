import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { token } = await auth0.getAccessToken();
    const { id } = params;

    const response = await fetch(`${API_BASE_URL}/api/watchlists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to fetch watchlist" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { token } = await auth0.getAccessToken();
    const { id } = params;
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/watchlists/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to update watchlist" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating watchlist:", error);
    return NextResponse.json(
      { error: "Failed to update watchlist", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { token } = await auth0.getAccessToken();
    const { id } = params;

    const response = await fetch(`${API_BASE_URL}/api/watchlists/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { error: data.error || "Failed to delete watchlist" },
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("Error deleting watchlist:", error);
    return NextResponse.json(
      { error: "Failed to delete watchlist", details: error.message },
      { status: 500 }
    );
  }
}
