
import { Navbar, Footer } from "@/components/layout"
import { HeroSection, CommunitySection, WatchlistSection, FeaturesSection } from "@/components/home"
import { ChartPreview, MarketOverview } from "@/components/market"
import { LoadingScreen } from "@/components/shared"
import { auth0 } from "@/lib/auth0"

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
