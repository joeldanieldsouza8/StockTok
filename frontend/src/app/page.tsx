
import { Navbar } from "@/src/components/navbar"
import { HeroSection } from "@/src/components/hero-section"
import { MarketOverview } from "@/src/components/market-overview"
import { ChartPreview } from "@/src/components/chart-preview"
import { CommunitySection } from "@/src/components/community-section"
import { WatchlistSection } from "@/src/components/watchlist-section"
import { FeaturesSection } from "@/src/components/features-section"
import { Footer } from "@/src/components/footer"
import { LoadingScreen } from "@/src/components/loading-screen"

export default function Home() {
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
      </main>
      <Footer />
    </>
  )
}
