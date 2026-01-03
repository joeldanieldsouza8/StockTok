"use client"

import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { Button } from "components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import { Avatar, AvatarFallback } from "components/ui/avatar";
import { Badge } from "components/ui/badge";
import { PostItem, PostItemObject } from 'lib/types/post-item';
import { createPost, addComment } from 'lib/api/social-posts-service';
import {
    Plus,
    X,
    MessageCircle,
    Send,
    Clock,
    User,
    Loader2,
    MessageSquareOff
} from "lucide-react";

interface PostsFeedProps {
    symbol: string;
    initialPosts: PostItem[];
}

export default function PostsFeed({ symbol, initialPosts }: PostsFeedProps) {
    const { user, isLoading } = useUser();
    const router = useRouter();

    const [posts, setPosts] = useState<PostItem[]>(initialPosts);

    const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newPost, setNewPost] = useState({
        title: "",
        description: "",
    });

    const currentUsername = user?.nickname || user?.name;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setNewPost(prev => ({ ...prev, [id]: value }));
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert("You must be logged in to post.");
            return;
        }

        if (!newPost.title.trim() || !newPost.description.trim()) {
            setError("Please fill in both title and description");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const payload: PostItemObject = {
            username: currentUsername as string,
            title: newPost.title.trim(),
            description: newPost.description.trim(),
            time_created: new Date().toISOString(),
            ticker: symbol,
            comments: []
        };

        try {
            const createdPost = await createPost(payload);
            setPosts(prev => [createdPost, ...prev]);
            setNewPost({ title: "", description: "" });
            setShowForm(false);
        } catch (err) {
            console.error(err);
            setError("Failed to create post.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddComment = async (postId: string) => {
        if (!user) {
            console.error('User must be logged in to comment');
            return;
        }

        if (!commentText.trim()) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const created = await addComment(postId, commentText);

            const newComment = {
                id: created.data.id,
                username: (currentUsername as string) ?? "unknown",
                content: created.data.content,
                time_created: created.data.createdAt,
            };

            setPosts(prev =>
                prev.map(p =>
                    p.id === postId
                        ? { ...p, comments: [...(p.comments ?? []), newComment] }
                        : p
                )
            );

            setCommentText("");
        } catch (error) {
            console.error('Error adding comment:', error);
            setError('Failed to add comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDateTime = (dateString: string | Date) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getInitials = (username: string) => {
        return username.slice(0, 2).toUpperCase();
    };

    return (
        <div className="max-w-3xl mx-auto pb-10">
            {/* Create Post Section */}
            <div className="mb-6">
                {!showForm ? (
                    <Card
                        className="cursor-pointer hover:border-primary/50 transition-all"
                        onClick={() => user ? setShowForm(true) : router.push('/api/auth/login')}
                    >
                        <CardContent className="py-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {user ? getInitials(currentUsername || 'U') : <User className="h-4 w-4" />}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 bg-secondary/50 rounded-full px-4 py-2.5 text-muted-foreground text-sm">
                                    {user ? `Share your thoughts on ${symbol}...` : 'Sign in to join the discussion...'}
                                </div>
                                <Button size="sm" className="gap-1">
                                    <Plus className="h-4 w-4" />
                                    Post
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-primary/50">
                        <form onSubmit={handleCreatePost}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Badge variant="secondary" className="font-mono">${symbol}</Badge>
                                        New Post
                                    </CardTitle>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setShowForm(false);
                                            setNewPost({ title: "", description: "" });
                                            setError(null);
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && (
                                    <div className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-md">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={newPost.title}
                                        onChange={handleInputChange}
                                        placeholder="Give your post a title..."
                                        className="bg-secondary/30"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Content</Label>
                                    <Textarea
                                        id="description"
                                        value={newPost.description}
                                        onChange={handleInputChange}
                                        placeholder="Share your analysis, questions, or insights..."
                                        className="bg-secondary/30 min-h-[120px] resize-none"
                                        required
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2 pt-0">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setShowForm(false);
                                        setNewPost({ title: "", description: "" });
                                        setError(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="gap-2">
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Publish
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                )}
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Card key={post.id} className="overflow-hidden hover:border-primary/30 transition-all">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                                {getInitials(post.username)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">@{post.username}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatDateTime(post.time_created)}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="font-mono text-primary border-primary/30">
                                        ${post.ticker}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0 pb-3">
                                <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                                <p className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">
                                    {post.description}
                                </p>
                            </CardContent>

                            <CardFooter className="flex flex-col items-stretch pt-0 border-t border-border">
                                {/* Comment Toggle */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="justify-start gap-2 text-muted-foreground hover:text-primary -mx-2 mt-2"
                                    onClick={() => {
                                        if (post.id) {
                                            setExpandedPostId(expandedPostId === post.id ? null : post.id);
                                            setCommentText("");
                                        }
                                    }}
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    {post.comments?.length || 0} Comments
                                </Button>

                                {/* Comments Section */}
                                {expandedPostId === post.id && (
                                    <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {/* Existing Comments */}
                                        {post.comments && post.comments.length > 0 && (
                                            <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                                                {post.comments.map((comment, idx) => (
                                                    <div key={idx} className="bg-secondary/30 p-3 rounded-lg">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium text-xs text-primary">
                                                                @{comment.username}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatDateTime(comment.time_created)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm">{comment.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Comment Input */}
                                        {user ? (
                                            <div className="flex gap-2 pt-2">
                                                <Avatar className="h-8 w-8 shrink-0">
                                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                        {getInitials(currentUsername || 'U')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 flex gap-2">
                                                    <Input
                                                        placeholder="Write a comment..."
                                                        value={commentText}
                                                        onChange={(e) => setCommentText(e.target.value)}
                                                        className="h-9 text-sm bg-secondary/30"
                                                        disabled={isSubmitting}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.shiftKey && post.id) {
                                                                e.preventDefault();
                                                                handleAddComment(post.id);
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        size="sm"
                                                        className="h-9 px-3"
                                                        onClick={() => post.id && handleAddComment(post.id)}
                                                        disabled={isSubmitting || !commentText.trim()}
                                                    >
                                                        {isSubmitting ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Send className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-secondary/20 rounded-lg p-4 text-center">
                                                <p className="text-sm text-muted-foreground">
                                                    <span
                                                        className="text-primary font-medium cursor-pointer hover:underline"
                                                        onClick={() => router.push('/api/auth/login')}
                                                    >
                                                        Sign in
                                                    </span>
                                                    {' '}to join the conversation
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <Card className="py-16">
                        <CardContent className="text-center">
                            <MessageSquareOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                            <p className="text-muted-foreground text-sm mb-4">
                                Be the first to start a discussion about {symbol}
                            </p>
                            {user ? (
                                <Button onClick={() => setShowForm(true)} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create First Post
                                </Button>
                            ) : (
                                <Button onClick={() => router.push('/api/auth/login')} className="gap-2">
                                    Sign in to Post
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}