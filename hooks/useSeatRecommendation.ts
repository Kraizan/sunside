import { useMemo } from 'react';
import * as turf from '@turf/turf';
import { Feature, LineString } from 'geojson';
import { Airport } from '@/types/airport';
import { SeatRecommendation } from '@/types/flight';
import { FlightDetails } from '@/types/flight';
import { generateAdvancedRecommendation } from '@/lib/utils';

interface UseSeatRecommendationReturn {
  recommendation: SeatRecommendation | null;
  flightPath: Feature<LineString> | undefined;
}

export function useSeatRecommendation(
  flightDetails: FlightDetails,
  sourceAirport: Airport | null,
  destAirport: Airport | null
): UseSeatRecommendationReturn {
  return useMemo(() => {
    if (!sourceAirport || !destAirport) {
      return { recommendation: null, flightPath: undefined };
    }

    const coordinates = [
      [sourceAirport.location.lon, sourceAirport.location.lat],
      [destAirport.location.lon, destAirport.location.lat]
    ];
    
    const path = turf.lineString(coordinates);
    const flightPath = turf.bezierSpline(path, { resolution: 10000, sharpness: 0.85 });
    const recommendation = generateAdvancedRecommendation(flightDetails, sourceAirport, destAirport);

    return { recommendation, flightPath: flightPath as Feature<LineString> };
  }, [sourceAirport?.location.lon, sourceAirport?.location.lat, 
      destAirport?.location.lon, destAirport?.location.lat,
      flightDetails.source, flightDetails.destination, flightDetails.departureTime]);
}
