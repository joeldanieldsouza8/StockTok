import { getAllPosts } from 'lib/api/social-posts-service';

import PostsFeed from './posts-feed';

interface PostsTabProps {
  symbol: string;
}

export default async function PostTab({ symbol }: PostsTabProps) {
  const allPosts = await getAllPosts();
  
  console.log("All posts from the backend")
  console.log(allPosts)

  const filteredPosts = allPosts
      .filter(p => p.ticker === symbol)
      .sort((a, b) => new Date(b.time_created).getTime() - new Date(a.time_created).getTime());

  return <PostsFeed symbol={symbol} initialPosts={filteredPosts} />;
}