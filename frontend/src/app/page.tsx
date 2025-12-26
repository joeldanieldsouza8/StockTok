
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
