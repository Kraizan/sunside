import { FlightDetails } from '@/types/flight';
export function getBearing(srcCoords: [number, number], destCoords: [number, number]): number {
  // TODO: Implement flight direction calculation
  return 0;
}

export function getSunPosition(time: Date, coords: [number, number]): number {
  // TODO: Implement sun azimuth calculation
  return 0;
}

export function recommendSide(flightDir: number, sunAzimuth: number): 'LEFT' | 'RIGHT' {
  // TODO: Implement side recommendation logic
  return 'LEFT';
}

export function parseFlightDetails(params: URLSearchParams): FlightDetails {
  return {
    source: params.get('source') || '',
    destination: params.get('destination') || '',
    departureTime: params.get('departureTime') || '',
    duration: Number(params.get('duration')) || 0,
  };
}