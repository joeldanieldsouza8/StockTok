'use server'

import { createPost } from "@/lib/api/posts-service";
import { revalidatePath } from "next/cache";
import {CreatePostDto} from "@/lib/types/post-item";

export async function createPostAction(prevState: any, formData: FormData) {
    const ticker = formData.get("ticker") as string;
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    if (!title || !body || !ticker) {
        return { message: "Missing required fields", success: false };
    }

    const payload: CreatePostDto = {
        title,
        body,
        ticker
    };

    try {
        // server-side service call (handles Auth0 token internally)
        await createPost(payload);

        // Purge cache for this specific path so new post appears immediately
        revalidatePath(`/feed/${ticker}`);

        return { message: "Post created successfully", success: true };
    } catch (error) {
        console.error("Failed to create post:", error);
        return { message: "Failed to create post. Please try again.", success: false };
    }
}