import { auth0 } from "@/lib/auth0";
import { Post, PostObject } from "@/types/post";

// Helper to determine the correct base URL
function getBaseUrl() {
  // if (typeof window !== "undefined") {
  //   // Client-side (Browser): Use public variable or localhost
  //   return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5069";
  // }

  // Server-side (Docker): Use the internal Gateway address
  // This must match the service name 'api-gateway' and internal port '8080'
  return process.env.BACKEND_API_URL || "http://api-gateway:8080";
}

function makeid(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function createPost(post: PostObject): Promise<Post> {
  post.id = makeid(5);

  const baseUrl = getBaseUrl();
  const endpoint = `${baseUrl}/api/posts`;

  // Note: This requires this function to be run Server-Side (Server Action)
  // because @/lib/auth0 is usually the server-side SDK.
  const token = await auth0.getAccessToken().catch(() => null);

  const headers: Headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token.token}`);
  }

  const request: RequestInfo = new Request(endpoint, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(post),
  });

  const response = await fetch(request);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create post: ${response.status} ${errorText}`);
  }

  const newPost: Post = await response.json();
  return newPost;
}

export async function getAllPosts(): Promise<Post[]> {
  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}/api/posts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status}`);
  }

  return response.json();
}

export async function getPostsByTickers(
  tickers: string | string[]
): Promise<Post[]> {
  const symbols = Array.isArray(tickers) ? tickers : [tickers];

  // Safety check for empty lists
  if (symbols.length === 0) return [];

  const formattedTickers = symbols.map((s) => encodeURIComponent(s)).join(",");
  const baseUrl = getBaseUrl();

  const response = await fetch(
    `${baseUrl}/api/posts?ticker=${formattedTickers}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    // If the service is down or returns 404, we might want to return empty
    // rather than crashing the whole page
    console.warn(
      `[PostsService] Failed to fetch for tickers ${formattedTickers}: ${response.status}`
    );
    return [];
  }

  return response.json();
}