import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NewsTab from "@/src/app/feed/[symbol]/_components/news-tab";
import PostTab from "./_components/social-tab";

interface FeedPageProps {
    params: Promise<{symbol: string}>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FeedPage({ params }: FeedPageProps) {
    const { symbol } = await params;

    const upperSymbol = symbol.toUpperCase();
    
    return (
        <Tabs defaultValue="posts" className="w-full">
            <TabsList className="mx-auto w-fit mt-10">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
                <PostTab />
            </TabsContent>
            
            <TabsContent value="news">
                <NewsTab symbol={upperSymbol} />
            </TabsContent>
        </Tabs>
    )
}