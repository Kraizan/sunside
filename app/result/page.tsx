'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ResultSummary from '@/components/ResultSummary';
import { parseFlightDetails } from '@/lib/utils';
import { Airport } from '@/types/airport';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const flightDetails = parseFlightDetails(searchParams);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [airports, setAirports] = useState<{source: Airport | null, destination: Airport | null}>({
    source: null,
    destination: null
  });

  useEffect(() => {
    async function fetchAirportData() {
      try {
        const [sourceData, destData] = await Promise.all([
          fetch(`/api/airports/${flightDetails.source}`).then(res => res.json()),
          fetch(`/api/airports/${flightDetails.destination}`).then(res => res.json())
        ]);

        if ('error' in sourceData || 'error' in destData) {
          throw new Error('Could not find airport data');
        }

        // Log all fields from the API response
        console.log('Source Airport Data:', {
          ICAO: sourceData.icao,
          IATA: sourceData.iata,
          Name: sourceData.name,
          Location: sourceData.location,
          Country: sourceData.country,
          Region: sourceData.region,
          TimeZone: sourceData.timeZone,
          Elevation: sourceData.elevation,
          Municipality: sourceData.municipality
        });

        console.log('Destination Airport Data:', {
          ICAO: destData.icao,
          IATA: destData.iata,
          Name: destData.name,
          Location: destData.location,
          Country: destData.country,
          Region: destData.region,
          TimeZone: destData.timeZone,
          Elevation: destData.elevation,
          Municipality: destData.municipality
        });

        setAirports({
          source: sourceData as Airport,
          destination: destData as Airport
        });

      } catch (err) {
        setError('Failed to fetch airport data');
        console.error('Error fetching airport data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (flightDetails.source && flightDetails.destination) {
      fetchAirportData();
    }
  }, [flightDetails.source, flightDetails.destination]);

  // Placeholder logic - will be replaced with actual calculation
  const recommendedSide = Math.random() > 0.5 ? 'LEFT' : 'RIGHT';

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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