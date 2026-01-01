s"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Menu, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="size-5">
                    <path
                      d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
                      fill="currentColor"
                      className="text-primary-foreground"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold">StockTok</span>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Beta
              </Badge>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#markets" className="text-sm font-medium hover:text-primary transition-colors">
                Markets
              </a>
              <a href="#community" className="text-sm font-medium hover:text-primary transition-colors">
                Community
              </a>
              <a href="#watchlist" className="text-sm font-medium hover:text-primary transition-colors">
                Watchlist
              </a>
              <a href="#docs" className="text-sm font-medium hover:text-primary transition-colors">
                Docs
              </a>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Desktop Search */}
              <div className="hidden lg:flex items-center relative">
                <Search className="absolute left-3 size-4 text-muted-foreground" />
                <Input placeholder="Search ticker or company..." className="pl-9 w-64" />
              </div>

              {/* Search Icon (Mobile/Tablet) */}
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Search className="size-5" />
              </Button>

              {/* Notification Bell */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
                <span className="absolute top-1 right-1 size-2 bg-destructive rounded-full" />
              </Button>

              {/* Auth Buttons */}
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
                <Button size="sm">Get Started</Button>
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border md:hidden"
        >
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            <a href="#markets" className="text-sm font-medium hover:text-primary transition-colors">
              Markets
            </a>
            <a href="#community" className="text-sm font-medium hover:text-primary transition-colors">
              Community
            </a>
            <a href="#watchlist" className="text-sm font-medium hover:text-primary transition-colors">
              Watchlist
            </a>
            <a href="#docs" className="text-sm font-medium hover:text-primary transition-colors">
              Docs
            </a>
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" className="flex-1 bg-transparent">
                Sign In
              </Button>
              <Button className="flex-1">Get Started</Button>
            </div>
          </nav>
        </motion.div>
      )}
    </>
  )
}
