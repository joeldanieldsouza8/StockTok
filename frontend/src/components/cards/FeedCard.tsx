import React from "react";
import { NewsCard } from "src/features/news/components/NewsCard";
import { FeedItem } from "src/types/feed";

interface FeedCardProps {
  item: FeedItem;
}

/**
 * A component deciding which card to render based on content type (i.e., news or social post)
 */
export function FeedCard({ item }: FeedCardProps) {
  // if (item.type === "user") {
  //   return <UserPostCard article={item.data} />;
  // }
  if (item.type === "news") {
    return <NewsCard article={item.data} />;
  }
}