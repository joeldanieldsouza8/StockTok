import { auth0 } from "@/lib/auth0";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_API_URL || "http://api-gateway:8080";

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();

    if (!session || !session.user) {
      console.warn("API Route: User not logged in.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await auth0.getAccessToken();

    const searchParams = request.nextUrl.searchParams;
    const symbols = searchParams.get("symbols");

    if (!symbols) {
      return NextResponse.json(
        { error: "No symbols provided" },
        { status: 400 }
      );
    }

    const url = `${API_BASE_URL}/api/news?symbols=${symbols}`;

    console.log(`Proxying to: ${url}`);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend Error (${response.status}): ${errorText}`);

      return NextResponse.json(
        { error: "Backend request failed", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("CRITICAL API ERROR:", error);

    if (error.code === "not_authenticated" || error.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
