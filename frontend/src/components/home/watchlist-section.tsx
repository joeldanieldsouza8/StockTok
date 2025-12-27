"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Bell, Target } from "lucide-react"

const watchlistItems = [
  { symbol: "AAPL", price: "$189.54", change: "+2.4%", positive: true, alertSet: true },
  { symbol: "TSLA", price: "$248.42", change: "+5.1%", positive: true, alertSet: true },
  { symbol: "NVDA", price: "$495.22", change: "-1.2%", positive: false, alertSet: false },
  { symbol: "GOOGL", price: "$142.35", change: "+0.8%", positive: true, alertSet: true },
]

const notifications = [
  { icon: Target, text: "AAPL crossed your target price $190.00", time: "5m ago", type: "success" },
  { icon: TrendingUp, text: "TSLA is up 4.2% since you added it", time: "1h ago", type: "success" },
  { icon: Bell, text: "New question in your followed tag: $NVDA", time: "2h ago", type: "info" },
]

export function WatchlistSection() {
  return (
    <section id="watchlist" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Watchlist Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Your Watchlist</h3>
                  <p className="text-sm text-muted-foreground">Track stocks that matter to you</p>
                </div>
              </div>

              <div className="space-y-3">
                {watchlistItems.map((item, index) => (
                  <motion.div
                    key={item.symbol}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-mono font-bold">{item.symbol}</div>
                      {item.alertSet && (
                        <Badge variant="outline" className="text-xs">
                          <Bell className="size-3 mr-1" />
                          Alert set
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.price}</div>
                      <div
                        className={`text-sm font-medium flex items-center gap-1 justify-end ${
                          item.positive ? "text-success" : "text-destructive"
                        }`}
                      >
                        {item.positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                        {item.change}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground mt-6 text-center">
                Build your watchlist and never miss a move
              </p>
            </Card>
          </motion.div>

          {/* Notifications Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="size-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Bell className="size-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Smart Alerts</h3>
                  <p className="text-sm text-muted-foreground">Never miss important movements</p>
                </div>
              </div>

              <div className="space-y-3">
                {notifications.map((notification, index) => {
                  const Icon = notification.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notification.type === "success" ? "bg-success/10 text-success" : "bg-accent/10 text-accent"
                        }`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-relaxed">{notification.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <p className="text-sm text-muted-foreground mt-6 text-center">
                Smart alerts for the stocks you care about
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
