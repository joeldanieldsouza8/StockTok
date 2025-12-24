"use client";

import { useEffect, useState } from "react";
import { Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { watchlistService } from "@/services/watchlist.service";
import { WatchlistResponse, TopTickersResponse } from "@/types";
import { WatchlistCard } from "@/components/watchlist/WatchlistCard";
import { CreateWatchlistDialog } from "@/components/watchlist/CreateWatchlistDialog";

export default function WatchlistDashboard() {
  const [watchlists, setWatchlists] = useState<WatchlistResponse[]>([]);
  const [topTickers, setTopTickers] = useState<TopTickersResponse[]>([]);
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
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Watchlists</h1>
          <p className="text-muted-foreground mt-2">
            Track your favorite stocks and manage your portfolios
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          size="lg"
          className="gap-2"
        >
          <Plus className="h-5 w-5" />
          New Watchlist
        </Button>
      </div>

      {/* Top Tickers Section */}
      {topTickers.length > 0 && (
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
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
                  className="flex items-center gap-2 bg-background rounded-lg px-4 py-2 border shadow-sm hover:shadow-md transition-shadow"
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

      <Separator className="my-8" />

      {/* Watchlists Grid */}
      {watchlists.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-6 mb-4">
              <TrendingUp className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No watchlists yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              Create your first watchlist to start tracking stocks and building
              your portfolio
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              size="lg"
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Your First Watchlist
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Create Watchlist Dialog */}
      <CreateWatchlistDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={handleCreateWatchlist}
      />
    </div>
  );
}
