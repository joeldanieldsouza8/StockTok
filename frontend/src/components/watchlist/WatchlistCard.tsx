"use client";

import { useState } from "react";
import Link from "next/link";
import {
    MoreVertical,
    Trash2,
    Edit,
    Plus,
    X,
    TrendingUp,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { WatchlistResponse } from "@/types";
import { EditWatchlistDialog } from "./EditWatchlistDialog";
import { DeleteWatchlistDialog } from "./DeleteWatchlistDialog";
import { AddTickerDialog } from "./AddTickerDialog";
import { watchlistService } from "@/services/watchlist.service";

interface WatchlistCardProps {
    watchlist: WatchlistResponse;
    onDelete: (id: string) => void;
    onUpdate: (id: string, name: string) => Promise<void>;
    onRefresh: () => void;
}

export function WatchlistCard({
                                  watchlist,
                                  onDelete,
                                  onUpdate,
                                  onRefresh,
                              }: WatchlistCardProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddTickerDialogOpen, setIsAddTickerDialogOpen] = useState(false);

    const handleRemoveTicker = async (e: React.MouseEvent, tickerId: string) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();
        try {
            await watchlistService.removeTicker(watchlist.id, tickerId);
            onRefresh();
        } catch (error) {
            console.error("Failed to remove ticker:", error);
        }
    };

    const tickerCount = watchlist.tickers.length;

    return (
        <>
            <Card className="group hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-xl truncate">
                                {watchlist.name}
                            </CardTitle>
                            <CardDescription className="mt-1">
                                {tickerCount} {tickerCount === 1 ? "ticker" : "tickers"}
                            </CardDescription>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setIsAddTickerDialogOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Ticker
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                    {tickerCount === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                            <div className="rounded-full bg-muted p-4 mb-3">
                                <TrendingUp className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                No tickers yet
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAddTickerDialogOpen(true)}
                                className="gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Ticker
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {watchlist.tickers.map((ticker) => (
                                <Link
                                    key={ticker.id}
                                    href={`/market/${ticker.id}`}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all group/ticker"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold group-hover/ticker:text-primary transition-colors">
                                            {ticker.id}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {ticker.stockName}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 opacity-0 group-hover/ticker:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                            onClick={(e) => handleRemoveTicker(e, ticker.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover/ticker:opacity-100 transition-opacity" />
                                    </div>
                                </Link>
                            ))}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAddTickerDialogOpen(true)}
                                className="w-full gap-2 mt-4"
                            >
                                <Plus className="h-4 w-4" />
                                Add More
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <EditWatchlistDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                watchlist={watchlist}
                onUpdate={onUpdate}
            />

            <DeleteWatchlistDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                watchlist={watchlist}
                onDelete={onDelete}
            />

            <AddTickerDialog
                open={isAddTickerDialogOpen}
                onOpenChange={setIsAddTickerDialogOpen}
                watchlistId={watchlist.id}
                watchlistName={watchlist.name}
                onSuccess={onRefresh}
            />
        </>
    );
}