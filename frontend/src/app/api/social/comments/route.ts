import { auth0 } from "@/lib/auth0"; // Adjust path to your file
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // chekcing session
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { token }  = await auth0.getAccessToken();
    console.log("DEBUG TOKEN:", token);

    const body = await req.json();

    // forwarding to backend
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        PostId: body.postId, 
        Body: body.content,  
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