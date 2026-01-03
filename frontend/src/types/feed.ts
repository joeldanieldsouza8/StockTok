import { PostItem } from "lib/types/post-item";
import { NewsArticle } from "./news";

export type FeedItem =
  | { type: "news"; data: NewsArticle }
  | { type: "post"; data: PostItem };

export interface Feed {
  items: FeedItem[];
}