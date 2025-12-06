"use client"  

import React, { useState } from 'react';
import { AppWindowIcon, CodeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // ⚠️ IMPORTANT: You must import or define this component for the content field.
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"


// structure of posts
interface Post {
    id: number;
    title: string;
    tag: string;
    content: string;
}

export default function TabsDemo() {
  // STATE: for posts
  const [posts, setPosts] = useState<Post[]>([
    { id: 101, title: "Initial Post", tag: "General", content: "This is a placeholder post in the social feed." },
  ]);
  
  const [newPost, setNewPost] = useState({
    title: '',
    tag: '',
    content: ''
  });

  const [showForm, setShowForm] = useState(false);

  // The toggle function now controls the visibility of the Create Post form
  const formDisplay = () => {
    setShowForm(!showForm);
  }

  // HANDLER: to look for input form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewPost(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // HANDLER: to create a new post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault(); 
    
    // Basic validation
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const postToAdd: Post = {
      id: Date.now(), 
      title: newPost.title.trim(),
      tag: newPost.tag.trim() || 'Untagged',
      content: newPost.content.trim(),
    };

    // adding the new post to the beginning of the posts array
    setPosts(prevPosts => [postToAdd, ...prevPosts]);
    
    // clearing the form fields and hide the form
    setNewPost({ title: '', tag: '', content: '' });
    setShowForm(false);
  };


  return (
    <div className="flex w-full max-w-sm flex-col gap-6">

      <form>
        <Button type="button" onClick={formDisplay}>
            {showForm ? 'Hide Create Post Form' : 'Show Create Post Form'}
        </Button>
      </form>

      {showForm && (
        <form onSubmit={handleCreatePost}>
          <Card>
            <CardHeader>
                <CardTitle>Create New Post</CardTitle>
                <CardDescription>Enter the title, tag, and content for your post.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
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
                    <Label htmlFor="tag">Tag</Label>
                    <Input 
                        id="tag" 
                        value={newPost.tag}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="content">Content</Label>
                    <Textarea // Assuming Textarea component is available
                        id="content" 
                        value={newPost.content}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </CardContent>
             <CardFooter>
                 <Button type="submit">Publish Post</Button>
             </CardFooter>
          </Card>
        </form>
      )}

      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Social</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        
        {/* 5. The "Social" container now displays the posts */}
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
                                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{post.tag}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No posts yet! Create one using the form above.</p>
                )}
            </CardContent>
            <CardFooter>
              <Button>Load More</Button>
            </CardFooter>
          </Card>
        </TabsContent>





        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-current">Current password</Label>
                <Input id="tabs-demo-current" type="password" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-new">New password</Label>
                <Input id="tabs-demo-new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
