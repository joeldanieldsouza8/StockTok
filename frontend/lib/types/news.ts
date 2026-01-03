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

export interface NewsArticleEntity {
  symbol: string,
  name: string,
  exchange: string,
  exchange_long: string,
  country: string,
  type: string,
  industry: string,
  match_score: number,
  sentiment_score: number,
}
