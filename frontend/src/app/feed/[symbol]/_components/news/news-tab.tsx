import { NewsItem } from "@/lib/types/news-item";
import { getNewsBySymbol } from "@/lib/api/news-service";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, MessageSquare, ThumbsUp } from "lucide-react";

interface NewsTabProps {
  symbol: string;
}

export default async function NewsTab({ symbol }: NewsTabProps) {
  const news = await getNewsBySymbol(symbol);
  // const news = newsData;
  
  // [DEBUG]
  // console.log("Printing the data from the news API")
  // console.log(news);
  
  // console.log("Printing the news article entities")
  // news.map((item) => {
  //   item.newsArticleEntities.map((entity) => {
  //     console.log("entity", entity);
  //   })
  // })

  return (
    <div className="flex flex-col">
      {news.map((item, index) => (
        <div
          key={item.uuid}
          className={`flex flex-col gap-3 py-6 ${
            // Add a separator line between items, but not after the last one
            index !== news.length - 1 ? "border-b border-border/50" : ""
          }`}
        >
          {/* Header: Avatar & Name */}
          {/*<div className="flex items-center gap-2">*/}
          {/*  <Avatar className="h-6 w-6">*/}
          {/*    <AvatarImage src={item.source.icon} alt={item.source.name} />*/}
          {/*    <AvatarFallback>{item.source.name[0]}</AvatarFallback>*/}
          {/*  </Avatar>*/}
          
          {/*  <span className="text-sm font-semibold text-foreground">*/}
          {/*    {item.source.name}*/}
          {/*  </span>*/}
          {/*  {item.source.isVerified && (*/}
          {/*    <CheckCircle2*/}
          {/*      className="h-4 w-4 text-blue-500"*/}
          {/*      fill="currentColor"*/}
          {/*      color="white"*/}
          {/*    />*/}
          {/*  )}*/}
          {/*</div>*/}

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold leading-tight text-foreground">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {/*{item.summary}*/}
            </p>
          </div>

          {/* Tickers */}
          <div className="flex gap-2">
            {/*{item.tickers.map((ticker) => (*/}
            {/*  <span*/}
            {/*    key={ticker}*/}
            {/*    className="text-sm font-bold text-blue-500 hover:underline cursor-pointer"*/}
            {/*  >*/}
            {/*    {ticker}*/}
            {/*  </span>*/}
            {/*))}*/}
          </div>

          {/* Footer Metrics */}
          <div className="flex items-center gap-4 text-muted-foreground mt-1">
            <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <ThumbsUp className="h-4 w-4" />
              {/*<span className="text-xs font-medium">{item.metrics.likes}</span>*/}
            </button>

            <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-medium">
                {/*{item.metrics.comments}*/}
              </span>
            </button>

            <span className="text-xs">• {item.publishedAt}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
