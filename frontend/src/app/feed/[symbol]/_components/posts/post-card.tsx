import {Post} from "@/lib/types/post";
import {Card, CardTitle} from "@/components/ui/card";
import {formatPostDate} from "@/lib/utils";

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    const { dateFormatted, timeFormatted } = formatPostDate(post.createdAt);

    return (
        <Card className="p-4 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                {/* If backend doesn't send username yet, we display a placeholder or AuthorId */}
                <p className="text-sm font-semibold text-blue-600">User: {post.authorId.substring(0, 8)}...</p>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md font-mono">
          ${post.ticker}
        </span>
            </div>

            <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
            <p className="text-sm text-foreground/80 mb-4 whitespace-pre-wrap">{post.body}</p>

            <div className="flex justify-between items-end border-t pt-2 mt-2">
                <div className="flex gap-4">
                    {/* Future: Upvote/Downvote buttons */}
                </div>

                <div className="text-xs text-muted-foreground text-right">
                    {dateFormatted} <br />
                    {timeFormatted}
                </div>
            </div>
        </Card>
    );
}