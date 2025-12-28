import {NewsArticle} from "lib/types/news-item";
//import { UserPost } from "./social";

export type FeedItem =
  | { type: "news"; data: NewsArticle }
  //| { type: "post"; data: UserPost };

export interface Feed {
  items: FeedItem[];
}