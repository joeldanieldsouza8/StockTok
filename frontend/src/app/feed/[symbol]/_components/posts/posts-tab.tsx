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

        // Pass ticker as query parameter to use the service (which includes comments)
        const response = await fetch(`${apiBaseUrl}/api/posts?ticker=${symbol}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            // Map backend response to frontend format
            allPosts = data.map((post: any) => ({
                id: post.id,
                username: post.username,
                title: post.title,
                description: post.body || post.description,
                time_created: post.createdAt || post.time_created,
                ticker: post.ticker,
                comments: post.comments?.map((c: any) => ({
                    id: c.id,
                    username: c.authorId || 'Anonymous',
                    content: c.content || c.body,
                    time_created: c.createdAt,
                })) || [],
            }));
        } else {
            console.error("Failed to fetch posts:", response.status);
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
    }

    // No need to filter anymore - backend already filtered by ticker
    const sortedPosts = allPosts.sort(
        (a, b) => new Date(b.time_created).getTime() - new Date(a.time_created).getTime()
    );

    return <PostsFeed symbol={symbol} initialPosts={sortedPosts} />;
}