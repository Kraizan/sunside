'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { parseFlightDetails, generateAdvancedRecommendation } from '@/lib/utils';
import * as turf from '@turf/turf';
import { Airport } from '@/types/airport';
import { SeatRecommendation } from '@/types/flight';
import { Feature, LineString } from 'geojson';
import { FlightMap, ResultSummary, LoadingState, ErrorState } from '@/components/results';

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
  const [currentTime, setCurrentTime] = useState<Date>(new Date(flightDetails.departureTime));

  const handleTimeChange = (newTime: Date) => {
    setCurrentTime(newTime);
  };

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
      const coordinates = [
        [airports.source.location.lon, airports.source.location.lat],
        [airports.destination.location.lon, airports.destination.location.lat]
      ];
      
      const path = turf.lineString(coordinates);
      const smooth = turf.bezierSpline(path, { resolution: 10000, sharpness: 0.85 });
      setFlightPath(smooth as Feature<LineString>);
      
      const rec = generateAdvancedRecommendation(flightDetails, airports.source, airports.destination);
      console.log(rec)
      setRecommendation(rec);
    }
  }, [airports.source, airports.destination]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <main>
      <Navbar />
      <div className="max-h-screen bg-background">
        {airports.source && airports.destination && (
          <div className="flex w-full">
            <FlightMap
              sourceAirport={airports.source}
              destAirport={airports.destination}
              flightPath={flightPath}
              startTime={new Date(flightDetails.departureTime)}
              durationMinutes={flightDetails.duration}
              currentTime={currentTime}
              className='w-3/5 z-1 p-2 rounded-xl'
            />
            {recommendation && (
              <ResultSummary 
                flightDetails={flightDetails}
                recommendation={recommendation}
                startTime={new Date(flightDetails.departureTime)}
                durationMinutes={flightDetails.duration}
                onTimeChange={handleTimeChange}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}