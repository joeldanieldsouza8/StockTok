import {NewsArticleEntity} from "@/lib/types/news-article-entity";

export interface NewsItem {
  uuid: string;
  // source: {
  //   name: string;
  //   icon: string;
  //   isVerified: boolean;
  // };
  title: string;
  description: string;
  url: string;
  // summary: string;
  // tickers: string[];
  // metrics: {
  //   likes: number;
  //   comments: number;
  // };
  publishedAt: string;
  newsArticleEntities: NewsArticleEntity[];
}
