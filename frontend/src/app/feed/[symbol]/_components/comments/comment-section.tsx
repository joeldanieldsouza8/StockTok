"use client"

import { useState, useEffect } from "react";
import { Comment } from "@/lib/types/comment";
import CommentItem from "./comment-item";
import CreateCommentForm from "./create-comment-form";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import {getCommentsByPostIdWrapper} from "@/src/app/feed/[symbol]/_components/comments/actions";

interface CommentSectionProps {
    postId: string;
    ticker: string;
}

export default function CommentSection({ postId, ticker }: CommentSectionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        if (isOpen && !hasLoaded) {
            setIsLoading(true);
            fetchComments();
        }
    }, [isOpen]);

    const fetchComments = async () => {
        try {
            // Calls the Server Action imported from comment-actions.ts
            const data = await getCommentsByPostIdWrapper(postId);
            setComments(data);
            setHasLoaded(true);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary p-0 h-auto"
                onClick={() => setIsOpen(!isOpen)}
            >
                <MessageSquare className="w-4 h-4 mr-1" />
                {isOpen ? "Hide Comments" : "Comments"}
            </Button>

            {isOpen && (
                <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-3 mb-4">
                        {isLoading ? (
                            <p className="text-xs text-muted-foreground">Loading comments...</p>
                        ) : comments.length > 0 ? (
                            comments.map(c => <CommentItem key={c.id} comment={c} />)
                        ) : (
                            <p className="text-xs text-muted-foreground">No comments yet.</p>
                        )}
                    </div>

                    <CreateCommentForm postId={postId} ticker={ticker} />
                </div>
            )}
        </div>
    );
}