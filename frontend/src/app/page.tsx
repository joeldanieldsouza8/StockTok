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
  );
}