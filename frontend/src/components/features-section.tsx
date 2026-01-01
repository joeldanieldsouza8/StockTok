"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { BarChart3, Bell, MessageSquare, TrendingUp } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Explore markets",
    description: "Browse real-time charts and market overviews across global exchanges",
  },
  {
    icon: Bell,
    title: "Build your watchlist",
    description: "Pin symbols and set alerts for price targets and important movements",
  },
  {
    icon: MessageSquare,
    title: "Join the discussion",
    description: "Ask questions and share analysis with thousands of active traders",
  },
  {
    icon: TrendingUp,
    title: "Take action",
    description: "Use community insights to inform your trading decisions",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How StockTok works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to trade smarter in one platform
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all">
                  <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
