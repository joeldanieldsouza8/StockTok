"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "components/ui/carousel";

interface ContentCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T) => string | number; // Add this for safety
  className?: string;
  showControls?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
}

/**
 * A generic, reusable carousel component for sifting through News and Social Posts feed on the homepage.
 * @param param0
 * @returns
 */
export function ContentCarousel<T>({
  items,
  renderItem,
  keyExtractor,
  className = "",
  showControls = true,
  autoplay = false,
  autoplayInterval = 5000,
}: ContentCarouselProps<T>) {
  const [api, setApi] = React.useState<any>();

  React.useEffect(() => {
    if (!api || !autoplay) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [api, autoplay, autoplayInterval]);

  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 text-lg">No items to display</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
        }}
        className={`w-full px-30 ${className}`}
      >
        <CarouselContent>
          {items.map((item, index) => (
            // 2. Use a real ID, fall back to index only if absolutely necessary
            <CarouselItem key={keyExtractor ? keyExtractor(item) : index}>
              {/* 3. Removed the restricting <div> wrapper */}
              {renderItem(item, index)}
            </CarouselItem>
          ))}
        </CarouselContent>{" "}
        {showControls && items.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 bg-slate-700 border-slate-600 text-white hover:bg-slate-600" />
            <CarouselNext className="absolute right-4 bg-slate-700 border-slate-600 text-white hover:bg-slate-600" />
          </>
        )}
      </Carousel>

      {/* Optional: Dots indicator */}
      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className="w-2 h-2 rounded-full bg-slate-600 hover:bg-slate-400 transition-colors"
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
