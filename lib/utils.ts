import { FlightDetails, SeatRecommendation, VisibilityWindow } from '@/types/flight';
import { Airport } from '@/types/airport';
import * as SunCalc from 'suncalc';
import { bearing } from '@turf/bearing';
import { format } from 'date-fns-tz';

export function getBearing(srcCoords: [number, number], destCoords: [number, number]): number {
  return bearing(
    [srcCoords[1], srcCoords[0]],
    [destCoords[1], destCoords[0]]
  );
}

export function getSunPosition(time: Date, coords: [number, number]): number {
  const sunPos = SunCalc.getPosition(time, coords[0], coords[1]);
  return (sunPos.azimuth * 180) / Math.PI + 180;
}

export function calculateVisibilityWindow(
  departureTime: Date,
  duration: number,
  sourceCoords: [number, number],
  timezone: string
): VisibilityWindow | undefined {
  // Implementation omitted for brevity - optional feature
  return undefined;
}

export function recommendSide(flightDir: number, sunAzimuth: number): 'LEFT' | 'RIGHT' {
  const relativeSunAngle = ((sunAzimuth - flightDir + 360) % 360) - 180;
  return relativeSunAngle < 0 ? 'LEFT' : 'RIGHT';
}

export function parseFlightDetails(params: URLSearchParams): FlightDetails {
  return {
    source: params.get('source') || '',
    destination: params.get('destination') || '',
    departureTime: params.get('departureTime') || '',
    duration: Number(params.get('duration')) || 0,
  };
}

export function generateRecommendation(
  flightDetails: FlightDetails,
  sourceAirport: Airport,
  destAirport: Airport
): SeatRecommendation {
  const departureTime = new Date(flightDetails.departureTime);
  const sourceCoords: [number, number] = [
    sourceAirport.location.lat,
    sourceAirport.location.lon
  ];
  const destCoords: [number, number] = [
    destAirport.location.lat,
    destAirport.location.lon
  ];

  const flightBearing = getBearing(sourceCoords, destCoords);
  const sunAzimuth = getSunPosition(departureTime, sourceCoords);
  const recommendedSide = recommendSide(flightBearing, sunAzimuth);
  
  const visibilityWindow = calculateVisibilityWindow(
    departureTime,
    flightDetails.duration,
    sourceCoords,
    sourceAirport.timeZone
  );

  const reason = `The sun will be on your ${recommendedSide.toLowerCase()} side during the flight, ` +
    `as you'll be flying towards ${Math.round(flightBearing)}° with the sun at ${Math.round(sunAzimuth)}°.`;

  return {
    side: recommendedSide,
    reason,
    visibilityWindow
  };
}