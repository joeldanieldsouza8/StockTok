import { auth0 } from "src/lib/auth0";
import { httpClient } from "lib/api/fetch-client";
import { PostItem, PostItemObject } from "../types/post-item";

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.BACKEND_API_URL|| "http://localhost:5069";
  }
  return process.env.BACKEND_API_URL || "http://api-gateway:8080";
};

const BACKEND_BASE_URL = getBaseUrl();

// Helper to get headers with Bearer token
async function getAuthHeaders() {
  const session = await auth0.getSession();
  const token = session?.accessToken;

  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export async function createPost(post: PostItemObject): Promise<PostItem> {
  const endpoint = `${BACKEND_BASE_URL}/api/posts`;
  const headers = await getAuthHeaders(); // Use the helper

  const response = await fetch(endpoint, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(post)
  });

  if (!response.ok) {
    throw new Error(`Failed to create post: ${response.status}`);
  }
  return await response.json();
}

export async function getAllPosts(): Promise<PostItem[]> {
  // NOTE: Ensure your lib/api/fetch-client.ts also calls auth0.getSession() 
  // and attaches the Authorization header, otherwise this will still 401.
  return await httpClient<PostItem[]>("/api/posts", {
    method: 'GET'
  });
}

export async function addComment(postId: string, content: string): Promise<PostItem> {
  const endpoint = `${BACKEND_BASE_URL}/api/comments`;
  const headers = await getAuthHeaders(); // ADDED TOKEN HERE

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      postId,
      content,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to add comment: ${response.status}`);
  }

  return response.json();
}