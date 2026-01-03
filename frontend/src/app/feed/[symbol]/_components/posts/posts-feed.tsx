import { Post } from "@/lib/types/post";
import PostCard from "./post-card";
import CreatePostForm from "./create-post-form";

interface PostsFeedProps {
    symbol: string;
    initialPosts: Post[];
}

export default function PostsFeed({ symbol, initialPosts }: PostsFeedProps) {
    return (
        <div className="w-full max-w-2xl mx-auto pb-10">
            {/* Form Component */}
            <CreatePostForm symbol={symbol} />

            {/* Feed Display */}
            <div className="flex flex-col gap-4">
                {initialPosts.length > 0 ? (
                    initialPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                ) : (
                    <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg">
                        <p>No posts yet for ${symbol}. Be the first to post!</p>
                    </div>
                )}
            </div>
        </div>
    );
}