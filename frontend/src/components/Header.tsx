"use client";

import Link from "next/link";
import { useState } from "react";
import AuthButtons from "./AuthButtons";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-40 border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-lg flex items-center gap-2">
            <span className="inline-block w-8 h-8 bg-blue-600 rounded-full" />
            <span>StockTok</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <Link href="/about" className="hover:text-gray-900">About</Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center">
          <AuthButtons />
        </div>

        {/* mobile menu button */}
        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((s) => !s)}
            className="p-2 rounded-md border"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white/95">
          <div className="px-4 py-3 flex flex-col gap-2">
            <Link href="/" className="py-2">Home</Link>
            <Link href="/about" className="py-2">About</Link>
            <div className="pt-2 border-t">
              <AuthButtons small />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
