"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"


interface HeroProps {
  isLoggedIn: boolean;
}

export function HeroSection({ isLoggedIn }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
      {/* Background Image - User will add this later */}
      <div className="absolute inset-0 z-0">
        <img src="/modern-dark-abstract-trading-background.png" alt="Hero background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/40 to-background" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            Live market data • Community driven
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Trade smarter with <span className="text-primary">charts, community</span> and alerts
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            StockTok combines TradingView-style charts with a Reddit-like community and real-time alerts for your
            watchlist.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
            {isLoggedIn ? (
              <Button>Go to Dashboard</Button>
            ) : (
              <Button size="lg" className="text-base group">
              Get Started
              <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            )}
            <Button size="lg" variant="outline" className="text-base bg-transparent">
              Explore Markets
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div>
              <div className="text-2xl font-bold text-foreground">10K+</div>
              <div>Active Traders</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">5K+</div>
              <div>Discussions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">50+</div>
              <div>Markets</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
