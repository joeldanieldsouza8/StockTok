'use server'

import { auth0 } from "@/src/lib/auth0";
import { Post, CreatePostDto} from "@/lib/types/post-item";
import {httpClient} from "@/lib/api/fetch-client";

// export async function createPost(post: PostItemObject): Promise<PostItem> {
//
//     post.id = makeid(5);
//
//     const endpoint = `${BACKEND_BASE_URL}/api/posts`
//     // const { token } = await auth0.getAccessToken(); // to add once backend is created
//
//     const headers: Headers = new Headers()
//     headers.set("Content-Type", "application/json")
//     headers.set("Accept", "application/json")
//
//     const request: RequestInfo = new Request(endpoint, {
//         method: "POST", 
//         headers: headers,
//         body: JSON.stringify(post)
//     })
//
//     const response = await fetch(request); 
//
//     if (!response.ok) {
//         throw new Error(`Failed to create post: ${response.status}`);
//     }
//     const newPost: PostItem = await response.json();
//     return newPost;
//
// }

export async function createPost(post: CreatePostDto): Promise<Post> {
  const endpoint = `/api/posts`

  const { token } = await auth0.getAccessToken();

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(post)
  };
  
  const createdPostDto = await httpClient<Post>(endpoint, options);
  
  return createdPostDto;
}

export async function getAllPostsBySymbol(symbol: string): Promise<Post[]> {
  const endpoint = `/api/posts`
  
  const { token } = await auth0.getAccessToken();

  // Construct query parameter string using URLSearchParams for safety
  const params = new URLSearchParams({ ticker: symbol });
  const url = `${endpoint}?${params.toString()}`;

  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, 
    },
  };
  
  const posts = await httpClient<Post[]>(url, options);
  
  return posts;
}

export async function getAllPosts(): Promise<Post[]> {
  const endpoint = `/api/posts`
  
  const { token } = await auth0.getAccessToken();

  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  };

  const posts = await httpClient<Post[]>(endpoint, options);
  
  return posts;
}