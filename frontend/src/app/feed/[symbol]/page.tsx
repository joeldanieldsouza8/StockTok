import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NewsTab from "@/src/app/feed/[symbol]/_components/news-tab";

interface FeedPageProps {
    params: Promise<{symbol: string}>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FeedPage({ params }: FeedPageProps) {
    const { symbol } = await params;

    const upperSymbol = symbol.toUpperCase();
    
    return (
        <Tabs defaultValue="posts" className="w-full">
            <TabsList>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
                This is the posts tab.
            </TabsContent>
            
            <TabsContent value="news">
                <NewsTab symbol={symbol} />
            </TabsContent>
        </Tabs>
    )
}