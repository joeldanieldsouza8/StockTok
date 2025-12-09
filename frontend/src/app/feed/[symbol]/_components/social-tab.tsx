"use client"  

import React, { useState } from 'react';
import { AppWindowIcon, CodeIcon } from "lucide-react"
import { auth0 } from '@/src/lib/auth0';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from "@/components/ui/button"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import { PostItem, PostItemObject } from '@/lib/types/post-item';
import { createPost } from '@/lib/api/social-posts-service';
import { redirect } from 'next/navigation';

export default function PostTab() {

  // for user data
  const {user, isLoading} = useUser();

  if (!isLoading && !user) {
    redirect("/");
  }

  const currentUsername = user?.nickname || user?.name;

  //STATE: for submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // STATE: for posts
  const [posts, setPosts] = useState<PostItem[]>([
    {  
      id: "1JKFV",
      username: "MathBoy122",
      title: "NVDA rockets!",
      description: "today NVDA started rocketing",
      time_created: new Date(Date.now()),
      ticker: "NVDA",
      upvotes: 0,
      downvotes: 0,
      comments: 0
    },
  ]);
  
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    ticker: "NVDA",
    time_created: new Date()
  });

  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formDisplay = () => {
    setShowForm(!showForm);
    setError(null);
  }

  // HANDLER: to look for input form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewPost(prevStateOfPost => ({
      ...prevStateOfPost, 
      [id]: value
    }));
  };

  // HANDLER: to create a new post
  const handleCreatePost = async (e: React.FormEvent) => {
    console.log("🔥 Form submitted!");
    e.preventDefault(); 
  
    console.log("📝 New post data:", newPost);
    
    if (!newPost.title.trim() || !newPost.description.trim()) {
      console.log("❌ Validation failed - empty fields");
      setError("Please fill in both title and description");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const payload: PostItemObject = {
      username: currentUsername as string,
      title: newPost.title.trim(),
      description: newPost.description.trim(),
      time_created: new Date(),
      ticker: newPost.ticker
    };

    console.log("payload:", payload);

    try {
      const newPostResponse: PostItem = await createPost(payload);
      console.log("Post created:", newPostResponse);
      setPosts(prevStateOfPost => [newPostResponse, ...prevStateOfPost]);

      setNewPost({title: "", description: "", ticker: 'NVDA', time_created: new Date() });
      setShowForm(false);
    
    } catch (error) {
      console.log("Error whilst creating post:", error);
      setError("Failed to create post. Please try again.");
    
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex w-full max-w-sm flex-col gap-6">

      {/* Toggle button - NO form wrapper */}
      <Button type="button" onClick={formDisplay}>
        {showForm ? 'Hide Create Post Form' : 'Show Create Post Form'}
      </Button>

      {showForm && (
        <form onSubmit={handleCreatePost}>
          <Card>
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
              <CardDescription>Enter the title, tag, and content for your post.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}
              <div className="grid gap-3">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={newPost.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Content</Label>
                <Textarea
                  id="description" 
                  value={newPost.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="ticker">Tag</Label>
                <Input 
                  id="ticker" 
                  value={newPost.ticker}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish Post"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}

      <Tabs defaultValue="account">
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Social Feed</CardTitle>
              <CardDescription>
                Current Posts
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Card key={post.id} className="p-4 border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-md">{post.title}</CardTitle>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{post.ticker}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{post.description}</p>
                    <p className="text-xs text-gray-500 mt-2">{post.time_created.toString()}</p>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500">No posts yet.. Create one.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button>Load More</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}