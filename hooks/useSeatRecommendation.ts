import { useState, useEffect } from 'react';
import * as turf from '@turf/turf';
import { Feature, LineString } from 'geojson';
import { Airport } from '@/types/airport';
import { SeatRecommendation } from '@/types/flight';
import { FlightDetails } from '@/types/flight';
import { generateAdvancedRecommendation } from '@/lib/helpers';

interface UseSeatRecommendationReturn {
  recommendation: SeatRecommendation | null;
  flightPath: Feature<LineString> | undefined;
}

export function useSeatRecommendation(
  flightDetails: FlightDetails,
  sourceAirport: Airport | null,
  destAirport: Airport | null
): UseSeatRecommendationReturn {
  const [recommendation, setRecommendation] = useState<SeatRecommendation | null>(null);
  const [flightPath, setFlightPath] = useState<Feature<LineString> | undefined>(undefined);

  useEffect(() => {
    if (sourceAirport && destAirport) {
      const coordinates = [
        [sourceAirport.location.lon, sourceAirport.location.lat],
        [destAirport.location.lon, destAirport.location.lat]
      ];
      
      const path = turf.lineString(coordinates);
      const smooth = turf.bezierSpline(path, { resolution: 10000, sharpness: 0.85 });
      setFlightPath(smooth as Feature<LineString>);
      
      const rec = generateAdvancedRecommendation(flightDetails, sourceAirport, destAirport);
      setRecommendation(rec);
    }
  }, [sourceAirport, destAirport, flightDetails]);

  return { recommendation, flightPath };
}
