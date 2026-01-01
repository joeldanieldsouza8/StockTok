"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, MessageSquare } from "lucide-react"

const threads = [
  {
    title: "Is NVDA a good buy right now with AI boom?",
    tags: ["NVDA", "AI", "Technical Analysis"],
    upvotes: 234,
    comments: 48,
    time: "2h ago",
    author: "StockGuru42",
  },
  {
    title: "My analysis on why AAPL will hit $200 this quarter",
    tags: ["AAPL", "Fundamentals"],
    upvotes: 189,
    comments: 32,
    time: "4h ago",
    author: "InvestorPro",
  },
  {
    title: "Tesla earnings preview - what to expect",
    tags: ["TSLA", "Earnings"],
    upvotes: 156,
    comments: 67,
    time: "6h ago",
    author: "MarketWatcher",
  },
  {
    title: "Best dividend stocks for passive income in 2024",
    tags: ["Dividends", "Long-term"],
    upvotes: 143,
    comments: 29,
    time: "8h ago",
    author: "DividendHunter",
  },
]

const tabs = ["Trending", "Newest", "Following"]

export function CommunitySection() {
  const [activeTab, setActiveTab] = useState("Trending")

  return (
    <section id="community" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ask. Share. Learn with the StockTok community</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Threads, questions and live discussions around every symbol
          </p>

          {/* Tab Filters */}
          <div className="flex justify-center gap-2 mb-8">
            {tabs.map((tab) => (
              <Button key={tab} variant={activeTab === tab ? "default" : "outline"} onClick={() => setActiveTab(tab)}>
                {tab}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto mb-8">
          {threads.map((thread, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, rotateX: 2 }}
            >
              <Card className="p-5 hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg leading-tight">{thread.title}</h3>

                  <div className="flex flex-wrap gap-2">
                    {thread.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag.startsWith("$") ? tag : `$${tag}`}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <ArrowUp className="size-4" />
                        {thread.upvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="size-4" />
                        {thread.comments}
                      </span>
                    </div>
                    <span>{thread.time}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" variant="outline">
            Ask a Question
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
