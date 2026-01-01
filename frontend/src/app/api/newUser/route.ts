'use server'
import { auth0 } from "@/lib/auth0";
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

    const response = await fetch(`${apiBaseUrl}/api/users/login`, {
      method: 'POST',  // Ensure it's POST as per the backend
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',  // Optional, but good practice
      },
    });

    const text = await response.text();
    let data;
    
    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        data = {rawResponse: text};
    }

    if (!response.ok) {
      // Log detailed error for debugging
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
        url: `${apiBaseUrl}/api/users/login`,
      });

      return NextResponse.json(
        {
          error: data.error || data.message || `API responded with status ${response.status}: ${response.statusText}`,
          details: data.details || text || "No response body.",
        },
        { status: response.status }
      );
    }

    // Log success for debugging
    console.log("Login successful:", data);

    return NextResponse.json(data);
  } catch (error: any) {
    // Log the full error for debugging
    console.error("Frontend Error:", error);

    // This will catch errors from getAccessToken (e.g., user not logged in)
    // or any network errors.
    return NextResponse.json(
      { 
        error: "Unauthorized or failed to fetch data", 
        details: error.message,
        stack: error.stack,  // Include stack for debugging (remove in production)
      },
      { status: 401 } // 401 Unauthorized
    );
  }
}