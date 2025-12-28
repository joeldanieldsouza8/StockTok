"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "components/ui/card"
import { Button } from "components/ui/button"
import { TrendingUp } from "lucide-react"

const timeframes = ["1D", "5D", "1M", "3M", "1Y", "ALL"]

export function ChartPreview() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M")

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Interactive charts built in</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            TradingView-style charting with candlesticks, indicators, and more
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-6 max-w-5xl mx-auto">
            {/* Chart Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">AAPL • Apple Inc.</div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold">$189.54</span>
                  <span className="text-success text-sm font-medium flex items-center gap-1">
                    <TrendingUp className="size-3" />
                    +4.32 (+2.4%)
                  </span>
                </div>
              </div>

              {/* Timeframe Selector */}
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                {timeframes.map((tf) => (
                  <Button
                    key={tf}
                    size="sm"
                    variant={selectedTimeframe === tf ? "default" : "ghost"}
                    className="h-8 px-3"
                    onClick={() => setSelectedTimeframe(tf)}
                  >
                    {tf}
                  </Button>
                ))}
              </div>
            </div>

            {/* Chart Area */}
            <div className="bg-muted/50 rounded-lg p-4 h-96 relative">
              {/* Grid Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={`h-${i}`}
                    x1="0"
                    y1={`${i * 25}%`}
                    x2="100%"
                    y2={`${i * 25}%`}
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <line
                    key={`v-${i}`}
                    x1={`${i * 12.5}%`}
                    y1="0"
                    x2={`${i * 12.5}%`}
                    y2="100%"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                ))}
              </svg>

              {/* Candlestick Chart Simulation */}
              <svg viewBox="0 0 800 300" className="w-full h-full">
                {/* Volume Bars */}
                {[...Array(30)].map((_, i) => (
                  <rect
                    key={`vol-${i}`}
                    x={i * 26 + 5}
                    y={280 - Math.random() * 40}
                    width="20"
                    height={Math.random() * 40}
                    fill="currentColor"
                    className="text-primary"
                    opacity="0.2"
                  />
                ))}

                {/* Candlesticks */}
                {[...Array(30)].map((_, i) => {
                  const isGreen = Math.random() > 0.5
                  const open = 100 + Math.random() * 100
                  const close = open + (Math.random() - 0.5) * 30
                  const high = Math.max(open, close) + Math.random() * 15
                  const low = Math.min(open, close) - Math.random() * 15

                  return (
                    <g key={`candle-${i}`}>
                      {/* Wick */}
                      <line
                        x1={i * 26 + 15}
                        y1={250 - high}
                        x2={i * 26 + 15}
                        y2={250 - low}
                        stroke={isGreen ? "oklch(0.60 0.18 145)" : "oklch(0.60 0.25 25)"}
                        strokeWidth="1"
                      />
                      {/* Body */}
                      <rect
                        x={i * 26 + 8}
                        y={250 - Math.max(open, close)}
                        width="14"
                        height={Math.abs(open - close) || 2}
                        fill={isGreen ? "oklch(0.60 0.18 145)" : "oklch(0.60 0.25 25)"}
                      />
                    </g>
                  )
                })}
              </svg>

              {/* Hover Tooltip Placeholder */}
              <div className="absolute top-4 left-4 bg-card border rounded-lg p-3 text-xs space-y-1 shadow-lg">
                <div className="flex gap-4">
                  <span className="text-muted-foreground">O:</span>
                  <span className="font-mono">187.23</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-muted-foreground">H:</span>
                  <span className="font-mono">189.75</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-muted-foreground">L:</span>
                  <span className="font-mono">186.54</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-muted-foreground">C:</span>
                  <span className="font-mono">189.54</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
