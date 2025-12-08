import { NewsItem } from "@/lib/types/news-item";
import { getNewsBySymbol } from "@/lib/api/news-service";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, MessageSquare, ThumbsUp } from "lucide-react";

interface NewsTabProps {
  symbol: string;
}

const newsData: NewsItem[] = [
  {
    id: "1",
    source: {
      // name: `${symbol} News`,
      name: "NVDA News",
      icon: "https://github.com/shadcn.png",
      isVerified: true,
    },
    title:
      "Market Chatter: AMD Prepared to Pay 15% Tax on AI Chip Shipments to China",
    summary:
      "Advanced Micro Devices ($AMD) has licenses to ship some of its MI 308 chips to China and is ready to pay a 15% tax to the Trump administration if it ships them...",
    tickers: ["NVDA", "AMD"],
    metrics: { likes: 4, comments: 1 },
    publishedAt: "1d",
  },
  {
    id: "2",
    source: {
      // name: `${symbol} News`,
      name: "NVDA News",
      icon: "https://github.com/shadcn.png",
      isVerified: true,
    },
    title:
      "NVDA Insider Sold Shares Worth $2,341,117, According to a Recent SEC Filing",
    summary:
      "A Brooke Seawell, Director, on December 02, 2025, sold 12,728 shares in Nvidia ($NVDA) for $2,341,117. Following the Form 4 filing with the SEC...",
    tickers: ["NVDA"],
    metrics: { likes: 7, comments: 1 },
    publishedAt: "1d",
  },
];

export default async function NewsTab({ symbol }: NewsTabProps) {
  // const news = await getNewsBySymbol(symbol);
  const news = newsData;

  return (
    <div className="flex flex-col">
      {news.map((item, index) => (
        <div
          key={item.id}
          className={`flex flex-col gap-3 py-6 ${
            // Add a separator line between items, but not after the last one
            index !== news.length - 1 ? "border-b border-border/50" : ""
          }`}
        >
          {/* Header: Avatar & Name */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={item.source.icon} alt={item.source.name} />
              <AvatarFallback>{item.source.name[0]}</AvatarFallback>
            </Avatar>

            <span className="text-sm font-semibold text-foreground">
              {item.source.name}
            </span>
            {item.source.isVerified && (
              <CheckCircle2
                className="h-4 w-4 text-blue-500"
                fill="currentColor"
                color="white"
              />
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold leading-tight text-foreground">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.summary}
            </p>
          </div>

          {/* Tickers */}
          <div className="flex gap-2">
            {item.tickers.map((ticker) => (
              <span
                key={ticker}
                className="text-sm font-bold text-blue-500 hover:underline cursor-pointer"
              >
                {ticker}
              </span>
            ))}
          </div>

          {/* Footer Metrics */}
          <div className="flex items-center gap-4 text-muted-foreground mt-1">
            <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <ThumbsUp className="h-4 w-4" />
              <span className="text-xs font-medium">{item.metrics.likes}</span>
            </button>

            <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-medium">
                {item.metrics.comments}
              </span>
            </button>

            <span className="text-xs">• {item.publishedAt}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
