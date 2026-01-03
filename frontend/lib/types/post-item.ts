export interface Comment {
    id?: string;
    username: string;
    content: string;
    time_created: string;
}


export interface PostItem {
    id?: string;
    username: string;
    title: string;
    description: string;
    time_created: Date;
    ticker: string;
    upvotes: number;
    downvotes: number;
    comments: Comment[];
}

export interface PostItemObject {
    id?: string;
    username: string;
    title: string;
    description: string;
    time_created: string;
    ticker: string;
    comments: Comment[];
}