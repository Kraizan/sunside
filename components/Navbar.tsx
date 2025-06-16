"use client";

import Link from 'next/link';
import { useTheme } from "next-themes"

export default function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="sticky top-0 left-0 right-0 p-4 bg-background backdrop-blur-xl border-b z-100">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-foreground">
          SunSide
        </Link>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="text-xl p-2 rounded-full bg-secondary-button text-secondary-button-foreground hover:bg-secondary-button/90 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
}