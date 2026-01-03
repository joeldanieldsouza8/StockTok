import { NewsArticle} from "lib/types/news-item";
import { getNewsBySymbol } from "lib/api/news-service";

import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { CheckCircle2, MessageSquare, ThumbsUp } from "lucide-react";

interface NewsTabProps {
  symbol: string;
}

const newsData: NewsArticle[] = [
  {
    uuid: "1",
    title:
      "Market Chatter: AMD Prepared to Pay 15% Tax to China!",
    description: "AMD announced 15% tax on AI chips coming from China!",
    url: "http://google.com",
    language: "eng",
    publishedAt: "1d",
    newsArticleEntities: [],
  },
  {
    uuid: "2", // 1. Changed 'id' to 'uuid' to match your interface
    title: "NVDA Insider Sold Shares Worth $2,341,117, According to a Recent SEC Filing",
    description: "A Brooke Seawell, Director, sold 12,728 shares in Nvidia ($NVDA).", // 2. Added missing description field
    url: "https://example.com/sec-filing", // 3. Added missing url field
    language: "eng",
    publishedAt: "2025-12-02T12:00:00Z", // 4. Recommended ISO date instead of "1d" to prevent 'Invalid Date' errors in NewsCard
    newsArticleEntities: [], // 5. Added missing required array
  },
];

export default async function NewsTab({ symbol }: NewsTabProps) {
  const news = newsData;

  return (
    <div className="flex flex-col">
      {news.map((item, index) => (
        <div
          key={item.uuid}
          className={`flex flex-col gap-3 py-6 ${
            index !== news.length - 1 ? "border-b border-border/50" : ""
          }`}
        >
          {/* 1. Content Area - Using only fields you actually have */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold leading-tight text-foreground">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description} {/* Changed from summary to description */}
            </p>
          </div>

          {/* 2. Footer - Only using publishedAt and a Link */}
          <div className="flex items-center gap-4 text-muted-foreground mt-1">
            <span className="text-xs">{item.publishedAt}</span>
            <a 
              href={item.url} 
              target="_blank" 
              className="text-xs text-blue-500 hover:underline"
            >
              Read Source
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}