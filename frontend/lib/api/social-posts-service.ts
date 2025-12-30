import { auth0 } from "src/lib/auth0";

import {NewsArticle} from "lib/types/news-item";
import {httpClient} from "lib/api/fetch-client";
import { PostItem, PostItemObject } from "../types/post-item";
import { Header } from "next/dist/lib/load-custom-routes";


const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || ""



function makeid(length: number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export async function createPost(post: PostItemObject): Promise<PostItem> {

    post.id = makeid(5);

    const endpoint = `${BACKEND_BASE_URL}/api/posts`
    // const { token } = await auth0.getAccessToken(); // to add once backend is created

    const headers: Headers = new Headers()
    headers.set("Content-Type", "application/json")
    headers.set("Accept", "application/json")

    const request: RequestInfo = new Request(endpoint, {
        method: "POST", 
        headers: headers,
        body: JSON.stringify(post)
    })

    const response = await fetch(request); 

    if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status}`);
    }
    const newPost: PostItem = await response.json();
    return newPost;

}


export async function getAllPosts(): Promise<PostItem[]> {
  const response = await fetch(`${BACKEND_BASE_URL}/api/posts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
}