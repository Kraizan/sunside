'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ResultSummary from '@/components/ResultSummary';
import { parseFlightDetails, generateRecommendation } from '@/lib/utils';
import * as turf from '@turf/turf';
import { Airport } from '@/types/airport';
import { SeatRecommendation } from '@/types/flight';
import { FlightMap } from '@/components/FlightMap';
import { Feature, LineString } from 'geojson';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const flightDetails = parseFlightDetails(searchParams);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [airports, setAirports] = useState<{source: Airport | null, destination: Airport | null}>({
    source: null,
    destination: null
  });
  const [recommendation, setRecommendation] = useState<SeatRecommendation | null>(null);
  const [flightPath, setFlightPath] = useState<Feature<LineString> | undefined>(undefined);
  const [sunEvents, setSunEvents] = useState([]);

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

  useEffect(() => {
    if (airports.source && airports.destination) {
      const path = turf.greatCircle(
        [airports.source.location.lon, airports.source.location.lat],
        [airports.destination.location.lon, airports.destination.location.lat],
        { npoints: Math.floor(flightDetails.duration / 5) }
      );

      // Ensure we're working with a LineString
      if (path.geometry.type === 'LineString') {
        setFlightPath(path as Feature<LineString>);
        const rec = generateRecommendation(flightDetails, airports.source, airports.destination);
        setRecommendation(rec);
      }
    }
  }, [airports.source, airports.destination]);

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
        {airports.source && airports.destination && (
          <div className="max-w-5xl mx-auto space-y-8">
            <FlightMap 
              sourceAirport={airports.source}
              destAirport={airports.destination}
              flightPath={flightPath}
              sunEvents={sunEvents}
            />
            {recommendation && (
              <ResultSummary 
                flightDetails={flightDetails}
                recommendation={recommendation}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}