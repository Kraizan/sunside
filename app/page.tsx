import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 text-gradient-sunset">SunSide</h1>
          <p className="text-xl text-gray-600 mb-8">
            Pick the perfect seat for sunrise or sunset
          </p>
          <Link
            href="/plan"
            className="inline-block px-8 py-4 bg-button text-button-foreground rounded-full text-lg font-medium hover:bg-button/90 transition-all hover:scale-105"
          >
            Plan Your Flight
          </Link>
        </div>
      </div>
    </main>
  );
}
