import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Button } from "components/ui/button";
import { ArrowLeft, BarChart3, MessageSquare, TrendingUp } from "lucide-react";
import PostsTab from "@/app/feed/[symbol]/_components/posts/posts-tab";
import Link from "next/link";
import { use } from 'react';

interface FeedPageProps {
    params: Promise<{ symbol: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function FeedPage({ params }: FeedPageProps) {
    const { symbol } = use(params);
    const upperSymbol = symbol.toUpperCase();

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/market/${upperSymbol}`}
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back to {upperSymbol} Chart
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <MessageSquare className="h-8 w-8 text-primary" />
                                <h1 className="text-3xl font-bold">{upperSymbol} Discussion</h1>
                            </div>
                            <p className="text-muted-foreground mt-1">
                                Join the conversation about {upperSymbol}
                            </p>
                        </div>

                        <Link href={`/market/${upperSymbol}`}>
                            <Button variant="outline" className="gap-2">
                                <BarChart3 className="h-4 w-4" />
                                View Chart
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="posts" className="w-full">
                    <TabsList className="bg-secondary/50 border border-border mb-6">
                        <TabsTrigger
                            value="posts"
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
                        >
                            <TrendingUp className="h-4 w-4" />
                            Posts
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="posts" className="mt-0">
                        <PostsTab symbol={upperSymbol} />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}