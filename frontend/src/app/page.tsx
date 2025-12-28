import { Navbar, Footer } from "@/components/layout";
import {
  HeroSection,
  CommunitySection,
  WatchlistSection,
  FeaturesSection,
} from "@/components/home";
import { ChartPreview, MarketOverview } from "@/components/market";
import { LoadingScreen } from "@/components/shared";
import { auth0 } from "@/lib/auth0";
import { FeedItem } from "../types/feed";
import { getFeedByTickers } from "../services/FeedService";
import { FeedCarousel } from "../components/cards/FeedCarousel";
import { WatchlistTicker } from "../types/watchlist";
import { getTopTickers } from "../services/WatchlistService";

export default async function Home() {
  // Fetch session server-side
  const session = await auth0.getSession();

  // Extract safe user info to pass to client components
  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        picture: session.user.picture,
        nickname: session.user.nickname,
      }
    : null;

  let feedItems: FeedItem[] = [];

  const tickers: WatchlistTicker[] = await getTopTickers(3);

  console.log("getTopTickers(): ", tickers);

  try {
    feedItems = await getFeedByTickers(tickers);
  } catch (error) {
    console.error("Failed to fetch feed items:", error);
  }

  return (
    <>
      <LoadingScreen />
      <Navbar user={user} />
      <main>
        <HeroSection isLoggedIn={!!user} />
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
