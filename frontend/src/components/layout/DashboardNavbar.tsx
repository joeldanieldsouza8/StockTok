"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Bell,
    Menu,
    Search,
    X,
    LogOut,
    Home,
    TrendingUp,
    BarChart3,
} from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TickerSearch } from "@/components/market";

interface DashboardNavbarProps {
    user: {
        name?: string;
        email?: string;
        picture?: string;
        nickname?: string;
    } | null;
}

export function DashboardNavbar({ user }: DashboardNavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
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
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                href="/"
                                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <Home className="h-4 w-4" />
                                Home
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <TrendingUp className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/market"
                                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <BarChart3 className="h-4 w-4" />
                                Markets
                            </Link>
                        </nav>

                        {/* Right Section */}
                        <div className="flex items-center gap-3">
                            {/* Desktop Search */}
                            <div className="hidden lg:block w-64">
                                <TickerSearch
                                    placeholder="Search ticker or company..."
                                    showTrending={true}
                                />
                            </div>

                            {/* Search Icon (Mobile/Tablet) */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            >
                                <Search className="size-5" />
                            </Button>

                            {/* Notification Bell */}
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="size-5" />
                                <span className="absolute top-1 right-1 size-2 bg-destructive rounded-full" />
                            </Button>

                            {/* User Menu */}
                            <div className="hidden sm:flex items-center gap-2">
                                {user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="relative h-10 w-10 rounded-full"
                                            >
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage
                                                        src={user.picture}
                                                        alt={user.name || "User"}
                                                    />
                                                    <AvatarFallback>
                                                        {user.name?.charAt(0) ||
                                                            user.nickname?.charAt(0) ||
                                                            "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <div className="flex items-center justify-start gap-2 p-2">
                                                <div className="flex flex-col space-y-1 leading-none">
                                                    {user.name && (
                                                        <p className="font-medium">{user.name}</p>
                                                    )}
                                                    {user.email && (
                                                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                                                            {user.email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard" className="cursor-pointer">
                                                    <TrendingUp className="mr-2 h-4 w-4" />
                                                    Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/market" className="cursor-pointer">
                                                    <BarChart3 className="mr-2 h-4 w-4" />
                                                    Markets
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/auth/logout" className="cursor-pointer">
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Log out
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <>
                                        <Link href="/auth/login?returnTo=/dashboard">
                                            <Button variant="ghost" size="sm">
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link href="/auth/login?returnTo=/onboarding">
                                            <Button size="sm">Get Started</Button>
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? (
                                    <X className="size-5" />
                                ) : (
                                    <Menu className="size-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Dropdown */}
                {mobileSearchOpen && (
                    <div className="lg:hidden border-t bg-background px-4 py-3">
                        <TickerSearch
                            placeholder="Search ticker or company..."
                            showTrending={true}
                            autoFocus
                        />
                    </div>
                )}
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border md:hidden">
                    <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
                        <Link
                            href="/"
                            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Home className="h-4 w-4" />
                            Home
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <TrendingUp className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/market"
                            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <BarChart3 className="h-4 w-4" />
                            Markets
                        </Link>
                        <div className="flex gap-2 pt-4 border-t">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg bg-muted">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={user.picture}
                                                alt={user.name || "User"}
                                            />
                                            <AvatarFallback>
                                                {user.name?.charAt(0) ||
                                                    user.nickname?.charAt(0) ||
                                                    "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {user.name || user.nickname}
                      </span>
                                            <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                                        </div>
                                    </div>
                                    <Link href="/auth/logout">
                                        <Button variant="outline" size="icon">
                                            <LogOut className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login?returnTo=/dashboard"
                                        className="flex-1"
                                    >
                                        <Button
                                            variant="outline"
                                            className="w-full bg-transparent"
                                        >
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link
                                        href="/auth/login?returnTo=/onboarding"
                                        className="flex-1"
                                    >
                                        <Button className="w-full">Get Started</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
}