"use client";

import { useEffect, useState } from "react";
import { Plus, TrendingUp, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { watchlistService } from "@/services/watchlist.service";
import { WatchlistResponse, TopTickersResponse } from "@/types";
import { WatchlistCard } from "@/components/watchlist/WatchlistCard";
import { CreateWatchlistDialog } from "@/components/watchlist";
import { TopTickerChart } from "@/components/watchlist/TopTickerChart";
import { FeedCarousel } from "@/components/cards/FeedCarousel";
import { FeedItem } from "@/types/feed";
import { getFeedByTickers } from "@/services/FeedService";

export default function WatchlistDashboard() {
  const [watchlists, setWatchlists] = useState<WatchlistResponse[]>([]);
  const [topTickers, setTopTickers] = useState<TopTickersResponse[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [watchlistsData, topTickersData] = await Promise.all([
        watchlistService.getWatchlists(),
        watchlistService.getTopTickers(5),
      ]);
      setWatchlists(watchlistsData);
      setTopTickers(topTickersData);

      if (topTickersData.length > 0) {
        try {
          const newsData = await getFeedByTickers(topTickersData);
          setFeedItems(newsData);
        } catch (newsError) {
          console.error("Failed to load news:", newsError);
        }
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWatchlist = async (name: string) => {
    try {
      await watchlistService.createWatchlist({ name });
      await loadDashboardData();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create watchlist:", error);
      throw error;
    }
  };

  const handleDeleteWatchlist = async (id: string) => {
    try {
      await watchlistService.deleteWatchlist(id);
      await loadDashboardData();
    } catch (error) {
      console.error("Failed to delete watchlist:", error);
    }
  };

  const handleUpdateWatchlist = async (id: string, name: string) => {
    try {
      await watchlistService.updateWatchlist(id, { name });
      await loadDashboardData();
    } catch (error) {
      console.error("Failed to update watchlist:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your watchlists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Layout: Sidebar + Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Market Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Track your favorite stocks and monitor market trends
              </p>
            </div>

            {/* Top Tickers Summary */}
            {topTickers.length > 0 && (
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Your Top Tickers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {topTickers.map((ticker) => (
                      <div
                        key={ticker.id}
                        className="flex items-center gap-2 bg-background rounded-lg px-4 py-2 border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div>
                          <p className="font-semibold text-lg">{ticker.id}</p>
                          <p className="text-xs text-muted-foreground">
                            {ticker.stockName}
                          </p>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {ticker.count} {ticker.count === 1 ? "list" : "lists"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stock Charts Section */}
            {topTickers.length > 0 ? (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Market Overview
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {topTickers.slice(0, 3).map((ticker) => (
                    <TopTickerChart
                      key={ticker.id}
                      tickerId={ticker.id}
                      stockName={ticker.stockName}
                      count={ticker.count}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <TrendingUp className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No tickers tracked yet</h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-sm">
                    Create a watchlist and add tickers to see market data here
                  </p>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* News Section - Future Implementation */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Newspaper className="h-6 w-6" />
                Market News
              </h2>
              {feedItems.length > 0 ? (
                <FeedCarousel items={feedItems} autoplay={false} />
              ) : (
                <p className="text-muted-foreground">
                  No news available for your tickers.
                </p>
              )}
            </div>
          </div>

          {/* Right Sidebar - Watchlists */}
          <aside className="lg:w-96 space-y-4">
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">My Watchlists</CardTitle>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {watchlists.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="rounded-full bg-muted p-4 w-fit mx-auto mb-3">
                      <TrendingUp className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      No watchlists yet
                    </p>
                    <Button
                      onClick={() => setIsCreateDialogOpen(true)}
                      size="sm"
                      variant="outline"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Create First Watchlist
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                    {watchlists.map((watchlist) => (
                      <WatchlistCard
                        key={watchlist.id}
                        watchlist={watchlist}
                        onDelete={handleDeleteWatchlist}
                        onUpdate={handleUpdateWatchlist}
                        onRefresh={loadDashboardData}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Create Watchlist Dialog */}
      <CreateWatchlistDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={handleCreateWatchlist}
      />
    </div>
  );
}
