"use client";

import * as React from "react";
import { FeedItem } from "../../types/feed";
import { ContentCarousel } from "./ContentCarousel";
import { FeedCard } from "./FeedCard";
import { useCallback } from "react";

interface FeedCarouselProps {
  items: FeedItem[];
  showControls?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
}

/**
 * Carousel implementation for the feed on the homepage.
 * It wraps the generic 'ContentCarousel' and injects specific logic for the feed cards.
 */
export function FeedCarousel({
  items,
  showControls,
  autoplay,
  autoplayInterval,
}: FeedCarouselProps) {

  const renderFeedCard = useCallback( // this function prevents unnecessary rerendering of ContentCarousel
    (item: FeedItem) => <FeedCard item={item} />,
    [] 
  );

  return (
    <ContentCarousel
      items={items}
      renderItem={renderFeedCard}
      showControls={showControls}
      autoplay={autoplay}
      autoplayInterval={autoplayInterval}
    />
  );
}
