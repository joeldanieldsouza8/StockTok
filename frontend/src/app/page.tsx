<<<<<<< HEAD

import { Navbar } from "@/src/components/navbar"
import { HeroSection } from "@/src/components/hero-section"
import { MarketOverview } from "@/src/components/market-overview"
import { ChartPreview } from "@/src/components/chart-preview"
import { CommunitySection } from "@/src/components/community-section"
import { WatchlistSection } from "@/src/components/watchlist-section"
import { FeaturesSection } from "@/src/components/features-section"
import { Footer } from "@/src/components/footer"
import { LoadingScreen } from "@/src/components/loading-screen"
import { auth0 } from "@/src/lib/auth0"
=======
import { auth0 } from "@/src/lib/auth0";
import DummyApiTester from "../components/DummyApiTester";
import { FeedCarousel } from "../components/cards/FeedCarousel";
import { getFeedByTicker } from "../services/FeedService";
import { FeedItem } from "../types/feed";
>>>>>>> 3877d1fc5ff1d628dad9df22d36789fedf126675

export default async function Home() {
  // Fetch session server-side
  const session = await auth0.getSession()
  
  // Extract safe user info to pass to client components
  const user = session?.user ? {
    name: session.user.name,
    email: session.user.email,
    picture: session.user.picture,
    nickname: session.user.nickname,
  } : null

<<<<<<< HEAD
=======
  // 2. If no session, render the public-facing login state.
  if (!session) {
    let feedItems: FeedItem[] = [];
    try {
      feedItems = await getFeedByTicker();
    } catch (error) {
      console.error('Failed to fetch feed items:', error);
    }

    return (
      <main className="flex flex-col min-h-screen p-8">
        <div>
          <h2>Please log in to continue.</h2>
          <a href="/auth/login">
            <button>Log in</button>
          </a>
        </div>
        <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col justify-center">
          <FeedCarousel items={feedItems} autoplay={false} />
        </div>
      </main>
    );
  }

  // 3. If a session exists, render the authenticated state.
>>>>>>> 3877d1fc5ff1d628dad9df22d36789fedf126675
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
      </main>
      <Footer />
    </>
  )
}
