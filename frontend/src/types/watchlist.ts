export interface Watchlist {
    id: string;
    userID: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    watchlistTickers?: WatchlistTicker[];
}

export interface WatchlistTicker {
    id: string;
    stockName: string;
    count: number;
}

export interface WatchlistApiResponse {
    data: Watchlist[];
}