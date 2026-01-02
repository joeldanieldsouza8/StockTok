import { NewsArticle } from "./news";
import { Post } from "./post";

export type FeedItem =
  | { type: "news"; data: NewsArticle }
  | { type: "post"; data: Post };

export interface Feed {
  items: FeedItem[];
}