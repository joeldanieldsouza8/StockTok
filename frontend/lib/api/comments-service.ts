import { httpClient } from "@/lib/api/fetch-client";
import { Comment, CreateCommentDto } from "@/lib/types/comment";
import { auth0 } from "@/src/lib/auth0";

const COMMENTS_ENDPOINT = "/api/comments";

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
    const { token } = await auth0.getAccessToken();

    const options: RequestInit = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    };

    // Matches C# Route: [HttpGet("post/{postId}")]
    return httpClient<Comment[]>(`${COMMENTS_ENDPOINT}/post/${postId}`, options);
}

export async function createComment(data: CreateCommentDto): Promise<Comment> {
    const { token } = await auth0.getAccessToken();

    const options: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    };

    return httpClient<Comment>(COMMENTS_ENDPOINT, options);
}