import { FlightDetails, SeatRecommendation } from '@/types/flight';
import { Airport } from '@/types/airport';
import SunCalc from 'suncalc';
import { bearing } from '@turf/bearing';

export function getBearing(srcCoords: [number, number], destCoords: [number, number]): number {
  return bearing(
    [srcCoords[1], srcCoords[0]],
    [destCoords[1], destCoords[0]]
  );
}

export function getSunPosition(time: Date, coords: [number, number]): number {
  const sunPos = SunCalc.getPosition(time, coords[0], coords[1]);
  return (sunPos.azimuth * 180) / Math.PI - 180;
}

export function recommendSide(flightDir: number, sunAzimuth: number): 'LEFT' | 'RIGHT' {
  const relativeSunAngle = (sunAzimuth - flightDir + 360) % 360;
  return relativeSunAngle > 0 && relativeSunAngle <= 180 ? 'RIGHT' : 'LEFT';
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

  const reason = `The sun will be on your ${recommendedSide.toLowerCase()} side during the flight, ` +
    `as you'll be flying towards ${Math.round(flightBearing)}° with the sun at ${Math.round(sunAzimuth)}°.`;

  return {
    side: recommendedSide,
    reason
  };
}

export function getSubsolarPoint(date: Date) {
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;

  // Convert a Date to number of days since J2000.0
  function toDays(date: Date): number {
    return (date.getTime() / 86400000) - 10957.5;
  }

  function rightAscension(l: number, b: number): number {
    return Math.atan2(
      Math.sin(l) * Math.cos(0) - Math.tan(b) * Math.sin(0),
      Math.cos(l)
    );
  }

  function declination(l: number, b: number): number {
    return Math.asin(
      Math.sin(b) * Math.cos(0) + Math.cos(b) * Math.sin(0) * Math.sin(l)
    );
  }

  function solarMeanAnomaly(d: number): number {
    return rad * (357.5291 + 0.98560028 * d);
  }

  function eclipticLongitude(M: number): number {
    const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    const P = rad * 102.9372; // perihelion of the Earth
    return M + C + P + Math.PI;
  }

  function sunCoords(d: number) {
    const M = solarMeanAnomaly(d);
    const L = eclipticLongitude(M);
    return {
      dec: declination(L, 0),
      ra: rightAscension(L, 0),
    };
  }

  function siderealTime(d: number, lw: number): number {
    return rad * (280.16 + 360.9856235 * d) - lw;
  }

  function normalizeLongitude(lon: number): number {
    return ((lon + 180) % 360 + 360) % 360 - 180;
  }

  const d = toDays(date);
  const { ra, dec } = sunCoords(d);
  const gst = siderealTime(d, 0); // Greenwich sidereal time in radians

  // Longitude = difference between RA and GST
  const lon = normalizeLongitude((ra - gst) * deg);
  const lat = dec * deg;

  return { lat, lon };
}
