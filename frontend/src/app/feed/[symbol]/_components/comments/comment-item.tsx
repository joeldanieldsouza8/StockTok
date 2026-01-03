import { Comment } from "@/lib/types/comment";
import {formatPostDate} from "@/lib/utils";

interface CommentItemProps {
    comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
    const { dateFormatted } = formatPostDate(comment.createdAt);

    return (
        <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg text-sm border">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className="font-semibold text-primary">
                    {/* Placeholder until backend sends username */}
                    User: {comment.authorId.substring(0, 8)}...
                </span>
                <span>{dateFormatted}</span>
            </div>
            <p className="text-foreground/90 whitespace-pre-wrap">{comment.body}</p>
        </div>
    );
}