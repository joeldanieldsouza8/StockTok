import { Navbar } from "@/src/components/navbar";
import { HeroSection } from "@/src/components/hero-section";
import { MarketOverview } from "@/src/components/market/market-overview";
import { ChartPreview } from "@/src/components/chart-preview";
import { CommunitySection } from "@/src/components/community-section";
import { WatchlistSection } from "@/src/components/user/watchlist-section";
import { FeaturesSection } from "@/src/components/features-section";
import { Footer } from "@/src/components/footer";
import { LoadingScreen } from "@/src/components/loading-screen";
import { FeedItem } from "../types/feed";
import { getFeedByTickers } from "../services/FeedService";
import { FeedCarousel } from "../components/cards/FeedCarousel";
import { WatchlistTicker } from "../types/watchlist";
import { getTopTickers } from "../services/WatchlistService";

export default async function Home() {
  let feedItems: FeedItem[] = [];

  const tickers: WatchlistTicker[] = await getTopTickers(3);

  console.log("getTopTickers(): ", tickers)

  try {
    feedItems = await getFeedByTickers(tickers);
  } catch (error) {
    console.error("Failed to fetch feed items:", error);
  }

  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main>
        <HeroSection />
        <MarketOverview />
        <ChartPreview />
        <CommunitySection />
        <WatchlistSection />
        <FeaturesSection />
        <FeedCarousel items={feedItems} autoplay={false} />
      </main>
      <Footer />
    </>
  );
}
