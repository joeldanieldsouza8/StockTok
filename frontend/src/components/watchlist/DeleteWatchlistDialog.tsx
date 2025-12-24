"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WatchlistResponse } from "@/types";

interface DeleteWatchlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  watchlist: WatchlistResponse;
  onDelete: (id: string) => void;
}

export function DeleteWatchlistDialog({
  open,
  onOpenChange,
  watchlist,
  onDelete,
}: DeleteWatchlistDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await onDelete(watchlist.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete watchlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Watchlist</DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{watchlist.name}</span>? This will
            remove the watchlist and all {watchlist.tickers.length}{" "}
            {watchlist.tickers.length === 1 ? "ticker" : "tickers"} from your
            account.
          </p>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Watchlist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
