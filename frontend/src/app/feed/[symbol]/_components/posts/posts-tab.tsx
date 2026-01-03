import { auth0 } from "@/lib/auth0";
import { PostItem } from 'lib/types/post-item';
import PostsFeed from './posts-feed';

interface PostsTabProps {
    symbol: string;
}

export default async function PostsTab({ symbol }: PostsTabProps) {
    const apiBaseUrl = process.env.BACKEND_API_URL || "http://api-gateway:8080";

    let allPosts: PostItem[] = [];

    try {
        const { token } = await auth0.getAccessToken();

        const response = await fetch(`${apiBaseUrl}/api/posts`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.ok) {
            allPosts = await response.json();
        } else {
            console.error("Failed to fetch posts:", response.status);
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
    }

    const filteredPosts = allPosts
        .filter(p => p.ticker === symbol)
        .sort((a, b) => new Date(b.time_created).getTime() - new Date(a.time_created).getTime());

    return <PostsFeed symbol={symbol} initialPosts={filteredPosts} />;
}