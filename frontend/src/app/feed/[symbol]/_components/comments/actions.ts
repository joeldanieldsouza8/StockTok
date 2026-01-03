'use server'

import {createComment, getCommentsByPostId} from "@/lib/api/comments-service";
import { CreateCommentDto } from "@/lib/types/comment";
import { revalidatePath } from "next/cache";

export async function createCommentAction(prevState: any, formData: FormData) {
    const body = formData.get("body") as string;
    const postId = formData.get("postId") as string;
    const ticker = formData.get("ticker") as string; // Needed for revalidation path

    if (!body || !postId) {
        return { message: "Comment body is required", success: false };
    }

    const payload: CreateCommentDto = {
        body,
        postId
    };

    try {
        await createComment(payload);

        // Revalidate the feed page so the new comment appears
        revalidatePath(`/feed/${ticker}`);

        return { message: "Comment added", success: true };
    } catch (error) {
        console.error("Failed to add comment:", error);
        return { message: "Failed to add comment", success: false };
    }
}

export async function getCommentsByPostIdWrapper(postId: string) {
    try {
        const comments = await getCommentsByPostId(postId);
        return comments;
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        return [];
    }
}