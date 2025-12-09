import { auth0 } from "@/src/lib/auth0";

import {NewsItem} from "@/lib/types/news-item";
import {httpClient} from "@/lib/api/fetch-client";
import { PostItem, PostItemObject } from "../types/post-item";
import { Header } from "next/dist/lib/load-custom-routes";


export async function getPosts(): Promise<PostItem[]> {
    const endpoint = "/api/posts"
    
    console.log("Calling GET", endpoint);
    
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
    }
    
    const posts: PostItem[] = await response.json();
    console.log("Received posts:", posts.length);
    return posts;
}

export async function createPost(post: PostItemObject): Promise<PostItem> {

    const endpoint = "/api/posts"
    // const { token } = await auth0.getAccessToken(); // to add once backend is created

    const headers: Headers = new Headers()
    headers.set("Content-Type", "application/json")
    headers.set("Accept", "application.json")

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