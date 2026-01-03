
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs"
import NewsTab from "@/app/feed/[symbol]/_components/news/news-tab";
import PostsTab from "@/app/feed/[symbol]/_components/posts/posts-tab";
import { use } from 'react'; // Import the use hook

interface FeedPageProps {
    params: Promise<{symbol: string}>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function FeedPage({ params }: FeedPageProps) {
    // Use the 'use' hook to unwrap the promise in client component
    const { symbol } = use(params);
    const upperSymbol = symbol.toUpperCase();
    
    return (
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mx-auto w-fit mt-10">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <PostsTab symbol={upperSymbol} />
        </TabsContent>

        <TabsContent value="news">
          <NewsTab symbol={upperSymbol} />
        </TabsContent>
      </Tabs>
    );
}