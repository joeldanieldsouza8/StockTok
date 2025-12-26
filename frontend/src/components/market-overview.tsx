"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

const marketData = [
  {
    symbol: "S&P 500",
    name: "SPX",
    price: "4,783.45",
    change: "+1.2%",
    positive: true,
    sparkline: "0,50 20,45 40,48 60,42 80,40 100,38 120,35 140,32 160,28 180,25 200,20",
  },
  {
    symbol: "NASDAQ",
    name: "IXIC",
    price: "15,282.01",
    change: "+1.8%",
    positive: true,
    sparkline: "0,55 20,52 40,48 60,45 80,42 100,38 120,35 140,30 160,25 180,22 200,18",
  },
  {
    symbol: "FTSE 100",
    name: "UKX",
    price: "7,512.89",
    change: "-0.4%",
    positive: false,
    sparkline: "0,25 20,28 40,32 60,35 80,38 100,42 120,45 140,48 160,52 180,55 200,58",
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: "189.54",
    change: "+2.4%",
    positive: true,
    sparkline: "0,60 20,55 40,50 60,45 80,40 100,35 120,38 140,30 160,25 180,20 200,15",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: "248.42",
    change: "+5.1%",
    positive: true,
    sparkline: "0,65 20,60 40,55 60,48 80,42 100,38 120,32 140,28 160,22 180,18 200,12",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA",
    price: "495.22",
    change: "-1.2%",
    positive: false,
    sparkline: "0,20 20,25 40,30 60,35 80,40 100,42 120,45 140,48 160,52 180,55 200,58",
  },
]

export function MarketOverview() {
  return (
    <section id="markets" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Today's Market</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time data from global markets and top movers
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketData.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1 }}
            >
              <Card className="p-5 hover:border-primary/50 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{stock.name}</div>
                    <div className="text-2xl font-bold">{stock.symbol}</div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>

                <div className="mb-3">
                  <div className="text-xl font-semibold">${stock.price}</div>
                  <div
                    className={`text-sm font-medium flex items-center gap-1 ${
                      stock.positive ? "text-success" : "text-destructive"
                    }`}
                  >
                    {stock.positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {stock.change}
                  </div>
                </div>

                <svg viewBox="0 0 200 60" className="w-full h-12">
                  <polyline
                    points={stock.sparkline}
                    fill="none"
                    stroke={stock.positive ? "oklch(0.60 0.18 145)" : "oklch(0.60 0.25 25)"}
                    strokeWidth="2"
                  />
                </svg>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
