'use server'
import { auth0 } from "@/src/lib/auth0";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // getAccessToken is the correct method. It enforces a session
    // and handles token refreshes automatically.
    const { token } = await auth0.getAccessToken();

    // --- TEMPORARY DEBUG LOG ---
    console.log("--- Access Token Sent to .NET ---");
    console.log(token);
    console.log("---------------------------------");
    // ---------------------------

    const apiBaseUrl = process.env.BACKEND_API_URL;
    if (!apiBaseUrl) {
      throw new Error("BACKEND_API_URL environment variable is not set.");
    }

    const response = await fetch(`${apiBaseUrl}/dummy`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.message || `API responded with status ${response.status}`,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    // This will catch errors from getAccessToken (e.g., user not logged in)
    // or any network errors.
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch data", details: error.message },
      { status: 401 } // 401 Unauthorized
    );
  }
}
