import { FeedItem } from "../types/feed";
import { getFeedByTickers } from "../services/FeedService";
import { FeedCarousel } from "../components/cards/FeedCarousel";
import { TopTickersResponse } from "../types/watchlist";
import { getTopTickers } from "../services/WatchlistService";
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { CommunitySection } from "@/components/community-section"
import { WatchlistSection } from "@/components/watchlist-section"
import { FeaturesSection } from "@/components/features-section"
import { ChartPreview } from "@/components/chart-preview"
import { MarketOverview } from "@/components/market-overview"
import { LoadingScreen } from "@/components/loading-screen"
import { auth0 } from "@/lib/auth0"

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

  // 2. If no session, render the public-facing login state.
  if (!session) {
    return (
      <main className="flex flex-col min-h-screen p-8">
        <div>
          <h2>Please log in to continue.</h2>
          <a href="/auth/login">
            <button>Log in</button>
          </a>
        </div>
      </main>
    );
  }

  let feedItems: FeedItem[] = [];

  const tickers: TopTickersResponse[] = await getTopTickers(3);

  try {
    feedItems = await getFeedByTickers(tickers);
  } catch (error) {
    console.error("Failed to fetch feed items:", error);
  }

  // 3. If a session exists, render the authenticated state.
  // Please check this to see if it looks okay
  return (
    <>
      <LoadingScreen />
      <Navbar user={user} />
      <main>
      <h1>Welcome, {session.user.name}!</h1>
      <img src={session.user.picture} alt={`Profile of ${session.user.name}`} />
      <h1>Your email: {session.user.email}</h1>
      <p>
        <a href="/auth/logout">
          <button>Log out</button>
        </a>
      </p>
      <hr style={{ margin: "2rem 0" }} />
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