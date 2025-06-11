"use client";

import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 p-4 bg-card/80 backdrop-blur-sm border-b z-10">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-foreground">
          SunSide
        </Link>
        <div className="flex items-center space-x-4">
          <Link 
            href="/plan"
            className="text-sm px-4 py-2 rounded-full bg-button text-button-foreground hover:bg-button/90 transition-colors"
          >
            Plan Flight
          </Link>
          <button
            onClick={toggleTheme}
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