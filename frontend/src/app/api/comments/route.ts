import { auth0 } from "@/lib/auth0";
import { NextRequest, NextResponse } from 'next/server';



const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return "";  // Client-side: relative URLs work
    }
    // Server-side: need absolute URL
    return process.env.APP_BASE_URL || "http://localhost:3000";
};


export async function POST(req: NextRequest) {
  try {
    // checking session
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { token } = await auth0.getAccessToken({
      audience: process.env.AUTH0_AUDIENCE,
    });

    console.log("DEBUG TOKEN:", token);

    const body = await req.json();


    

    // forwarding to backend
    const baseUrl = getBaseUrl();
    // const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/social/comments`, {
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        PostId: body.postId, 
        Content: body.content,  
      }),
    });

    if (!backendResponse.ok) {
        return NextResponse.json({ error: 'Backend error' }, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json({debugToken: token, data: data});

  } catch (error: any) {
    console.error("Auth0 v4 Error:", error);
    return NextResponse.json({ error: 'Authorization failed' }, { status: 401 });
  }
}