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
import { WatchlistResponse } from "@/types";

interface EditWatchlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  watchlist: WatchlistResponse;
  onUpdate: (id: string, name: string) => Promise<void>;
}

export function EditWatchlistDialog({
  open,
  onOpenChange,
  watchlist,
  onUpdate,
}: EditWatchlistDialogProps) {
  const [name, setName] = useState(watchlist.name);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Watchlist name is required");
      return;
    }

    if (name.trim() === watchlist.name) {
      onOpenChange(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await onUpdate(watchlist.id, name.trim());
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update watchlist");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName(watchlist.name);
      setError(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Watchlist</DialogTitle>
          <DialogDescription>
            Change the name of your watchlist
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Watchlist Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Tech Stocks, Growth Portfolio"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
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
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
