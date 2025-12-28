"use client"

import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { Button } from "components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "components/ui/card"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { Textarea } from "components/ui/textarea"
import { PostItem, PostItemObject } from 'lib/types/post-item';
import { createPost } from 'lib/api/posts-service';

interface PostsFeedProps {
    symbol: string;
    initialPosts: PostItem[]; 
}

export default function PostsFeed({ symbol, initialPosts }: PostsFeedProps) {
    const { user, isLoading } = useUser();
    const router = useRouter();

    const [posts, setPosts] = useState<PostItem[]>(initialPosts);

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

        // Auth Check
        if (!user) {
            // Redirect to login or show modal
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
            ticker: symbol 
        };

        try {
            const createdPost = await createPost(payload);

            setPosts(prev => [createdPost, ...prev]);

            setNewPost({title: "", description: ""});
            setShowForm(false);
        } catch (err) {
            console.error(err);
            setError("Failed to create post.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDateTime = (dateString: string | Date) => {
        const date = new Date(dateString);
        return {
            dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            timeFormatted: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        };
    };

    return (
        <div className="flex w-full max-w-2xl flex-col gap-6 mx-auto pb-10">

            {/* Create Post Section */}
            <div className='flex justify-end'>
                <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
                    {showForm ? 'Cancel' : 'Create Post'}
                </Button>
            </div>

            {showForm && (
                <form onSubmit={handleCreatePost}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Post for ${symbol}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            <div className="grid gap-3">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={newPost.title} onChange={handleInputChange} required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="description">Content</Label>
                                <Textarea id="description" value={newPost.description} onChange={handleInputChange} required />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Publishing..." : "Publish"}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            )}

            {/* Feed Section */}
            <div className="flex flex-col gap-4">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Card key={post.id} className="p-4 border-l-4 border-blue-500 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-semibold text-blue-600">@{post.username}</p>
                                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md font-mono">
                    ${post.ticker}
                  </span>
                            </div>
                            <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                            <p className="text-sm text-foreground/80 mb-4 whitespace-pre-wrap">{post.description}</p>

                            <div className="flex justify-between items-end border-t pt-2 mt-2">
                                {/* Placeholder for Upvote/Comment buttons (Next Task) */}
                                <div className="flex gap-4">
                                    {/* Your teammate will add buttons here */}
                                </div>

                                <div className="text-xs text-muted-foreground text-right">
                                    {formatDateTime(post.time_created).dateFormatted} <br/>
                                    {formatDateTime(post.time_created).timeFormatted}
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No posts yet for {symbol}.</p>
                    </div>
                )}
            </div>
        </div>
    )
}