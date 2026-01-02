"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { watchlistService } from "@/services/WatchlistService";

interface AddTickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  watchlistId: string;
  watchlistName: string;
  onSuccess: () => void;
}

export function AddTickerDialog({
  open,
  onOpenChange,
  watchlistId,
  watchlistName,
  onSuccess,
}: AddTickerDialogProps) {
  const [tickerId, setTickerId] = useState("");
  const [stockName, setStockName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tickerId.trim()) {
      setError("Ticker symbol is required");
      return;
    }

    if (!stockName.trim()) {
      setError("Stock name is required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await watchlistService.addTicker(watchlistId, {
        tickerId: tickerId.trim().toUpperCase(),
        stockName: stockName.trim(),
      });
      setTickerId("");
      setStockName("");
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add ticker");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTickerId("");
      setStockName("");
      setError(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Ticker to {watchlistName}</DialogTitle>
          <DialogDescription>
            Add a stock ticker to track in this watchlist
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ticker-id">Ticker Symbol</Label>
              <Input
                id="ticker-id"
                placeholder="e.g., AAPL, GOOGL, MSFT"
                value={tickerId}
                onChange={(e) => setTickerId(e.target.value.toUpperCase())}
                disabled={isLoading}
                autoFocus
                maxLength={10}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock-name">Company Name</Label>
              <Input
                id="stock-name"
                placeholder="e.g., Apple Inc., Alphabet Inc."
                value={stockName}
                onChange={(e) => setStockName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Ticker"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
