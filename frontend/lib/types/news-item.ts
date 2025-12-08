export interface NewsItem {
  id: string;
  source: {
    name: string;
    icon: string;
    isVerified: boolean;
  };
  title: string;
  summary: string;
  tickers: string[];
  metrics: {
    likes: number;
    comments: number;
  };
  publishedAt: string;
}
