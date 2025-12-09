export interface PostItem {
    id: string;
    username: string;
    title: string;
    description: string;
    time_created: Date;
    ticker: string;
    upvotes: number;
    downvotes: number;
    comments: number;
}

export interface PostItemObject extends Omit<PostItem, "id" | "upvotes" | "downvotes" | "comments"> {
    username: string,
    title: string;
    description: string;
    time_created: Date;
}