import { PostItem, PostItemObject } from "../types/post-item";

const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return "";  // Client-side: relative URLs work
    }
    // Server-side: need absolute URL
    return process.env.APP_BASE_URL || "http://localhost:3000";
};

export async function getAllPosts(): Promise<PostItem[]> {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/social/posts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    return response.json();
}

export async function createPost(post: PostItemObject): Promise<PostItem> {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/social/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
    });

    if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status}`);
    }

    return response.json();
}

// export async function addComment(postId: string, content: string): Promise<Comment> {
//     const baseUrl = getBaseUrl();
//     const response = await fetch(`${baseUrl}/api/comments`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ postId, content }),
//     });

//     if (!response.ok) {
//         throw new Error(`Failed to add comment: ${response.status}`);
//     }

//     return response.json();
// }

export async function addComment(postId: string, content: string) {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId, content }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add comment: ${response.status}`);
  }

  return response.json(); // backend DTO
}