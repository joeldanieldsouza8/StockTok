'use server'

import {getAllPosts, getAllPostsBySymbol} from '@/lib/api/posts-service';
import PostsFeed from './posts-feed';

interface PostsTabProps {
  symbol: string;
}

export default async function PostTab({ symbol }: PostsTabProps) {
  const posts = await getAllPostsBySymbol(symbol);
  
  // console.log("All posts from the backend")
  // console.log(posts)

  return <PostsFeed symbol={symbol} initialPosts={posts} />;
}