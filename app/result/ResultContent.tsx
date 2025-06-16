'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { parseFlightDetails } from '@/lib/utils';
import {
  FlightMap,
  ResultSummary,
  LoadingState,
  ErrorState,
} from "@/components/results";
import { useAirportData } from "@/hooks/useAirportData";
import { useSeatRecommendation } from "@/hooks/useSeatRecommendation";

export default function ResultContent() {
  const searchParams = useSearchParams();
  const flightDetails = useMemo(
    () => parseFlightDetails(searchParams),
    [searchParams]
  );

  const [currentTime, setCurrentTime] = useState(
    new Date(flightDetails.departureTime)
  );

  const { airports, loading, error } = useAirportData(
    flightDetails.source,
    flightDetails.destination
  );

  const { recommendation, flightPath } = useSeatRecommendation(
    flightDetails,
    airports.source,
    airports.destination
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!airports.source || !airports.destination || !recommendation) {
    return <ErrorState error="Invalid flight data" />;
  }

  return (
    <div className="max-h-screen bg-background flex w-full">
      <FlightMap
        sourceAirport={airports.source}
        destAirport={airports.destination}
        flightPath={flightPath}
        startTime={new Date(flightDetails.departureTime)}
        durationMinutes={flightDetails.duration}
        currentTime={currentTime}
        className="w-3/5 z-1 p-2 rounded-xl"
      />
      <ResultSummary
        flightDetails={flightDetails}
        recommendation={recommendation}
        startTime={new Date(flightDetails.departureTime)}
        durationMinutes={flightDetails.duration}
        onTimeChange={setCurrentTime}
      />
    </div>
  );
}
