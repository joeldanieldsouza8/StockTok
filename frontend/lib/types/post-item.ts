import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS } from "react";

export interface PostItem {
    id?: string;
    username: string;
    title: string;
    description: string;
    time_created: Date;
    ticker: string;
    upvotes: number;
    downvotes: number;
    comments: number;
}

export interface PostItemObject {
    id?: string;
    username: string;
    title: string;
    description: string;
    time_created: string;
    ticker: string;
}