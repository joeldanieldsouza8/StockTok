import { NextRequest, NextResponse } from 'next/server';
import { PostItem, PostItemObject } from 'lib/types/post-item';

// INITIAL STATE OF ARRAY STARTING WITH STATIC DATA (new posts get added)
let posts: PostItem[] = [

];


export async function GET() {
  console.log("GET /api/posts - Returning all posts, count:", posts.length);
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  try {
    const post: PostItemObject = await request.json();

    const newPost: PostItem = {
        id: Math.random().toString(36).substring(2, 9).toUpperCase(),
        username: post.username,
        title: post.title,
        description: post.description,
        time_created: new Date(post.time_created),
        ticker: post.ticker,
        upvotes: 0,
        downvotes: 0,
        comments: []
    };

    posts.unshift(newPost);
    console.log("Created post:", newPost);
    return NextResponse.json(newPost, { status: 201 });

  } catch (error) {
    console.error("Error in POST /api/posts:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}