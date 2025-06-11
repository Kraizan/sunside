'use client';

import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ResultSummary from '@/components/ResultSummary';

export default function ResultPage() {
  const searchParams = useSearchParams();
  
  const flightDetails = {
    source: searchParams.get('source') || '',
    destination: searchParams.get('destination') || '',
    departureTime: searchParams.get('departureTime') || '',
    duration: searchParams.get('duration') || '',
  };

  // Placeholder logic - will be replaced with actual calculation
  const recommendedSide = Math.random() > 0.5 ? 'LEFT' : 'RIGHT';

  return (
    <main>
      <Navbar />
      <div className="min-h-screen pt-24 px-4 bg-muted">
        <ResultSummary 
          flightDetails={flightDetails}
          recommendedSide={recommendedSide}
        />
      </div>
    </main>
  );
}