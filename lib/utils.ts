import { FlightDetails, SeatRecommendation } from '@/types/flight';
import { Airport } from '@/types/airport';
import SunCalc from 'suncalc';
import * as turf from '@turf/turf';

export function parseFlightDetails(searchParams: URLSearchParams): FlightDetails {
  const source = searchParams.get('source') || '';
  const destination = searchParams.get('destination') || '';
  const departureTime = searchParams.get('departureTime') || new Date().toISOString();
  const duration = parseInt(searchParams.get('duration') || '0', 10);
  return {
    source,
    destination,
    departureTime: new Date(departureTime).toISOString(),
    duration: isNaN(duration) ? 0 : duration
  };
}

export function getBearing(srcCoords: [number, number], destCoords: [number, number]): number {
  return turf.bearing(
    [srcCoords[1], srcCoords[0]],
    [destCoords[1], destCoords[0]]
  );
}

export function getSunAzimuthAt(time: Date, coords: [number, number]): number {
  const sunPos = SunCalc.getPosition(time, coords[0], coords[1]);
  return ((sunPos.azimuth * 180) / Math.PI + 180) % 360;
}

export function recommendSide(flightDir: number, sunAzimuth: number): 'LEFT' | 'RIGHT' {
  const relativeAngle = (sunAzimuth - flightDir + 360) % 360;
  if (relativeAngle === 0 || relativeAngle === 360 || relativeAngle === 180) {
    return 'LEFT'; // default side when directly in front/back (could also be "NEUTRAL")
  }
  return relativeAngle > 0 && relativeAngle <= 180 ? 'RIGHT' : 'LEFT';
}

export function generateAdvancedRecommendation(
  flightDetails: FlightDetails,
  sourceAirport: Airport,
  destAirport: Airport
): SeatRecommendation {
  const departureTime = new Date(flightDetails.departureTime);
  const duration = flightDetails.duration;
  const intervalMinutes = 1;

  const sourceCoords: [number, number] = [
    sourceAirport.location.lon,
    sourceAirport.location.lat
  ];
  const destCoords: [number, number] = [
    destAirport.location.lon,
    destAirport.location.lat
  ];
  const bearing = turf.bearing(sourceCoords, destCoords);

  const path = turf.lineString([
    [sourceCoords[1], sourceCoords[0]],
    [destCoords[1], destCoords[0]],
  ]);
  const length = turf.length(path);
  
  let leftCount = 0;
  let rightCount = 0;
  let sunriseSeen = false;
  let sunsetSeen = false;

  for (let i = 0; i <= duration; i += intervalMinutes) {
    const currentTime = new Date(departureTime.getTime() + i * 60 * 1000);
    const dist = (i / duration) * length;
    const [lat, lon] = turf.along(path, dist).geometry.coordinates;

    const azimuthDeg = getSunAzimuthAt(currentTime, [lat, lon]);

    const side = recommendSide(bearing, azimuthDeg);
    if (side === 'LEFT') leftCount++;
    else rightCount++;

    const times = SunCalc.getTimes(currentTime, lat, lon);
    const timeDiff = Math.abs(times.sunrise.getTime() - currentTime.getTime());
    const sunsetDiff = Math.abs(times.sunset.getTime() - currentTime.getTime());

    if (timeDiff < 15 * 60 * 1000) sunriseSeen = true;
    if (sunsetDiff < 15 * 60 * 1000) sunsetSeen = true;
  }

  const side = leftCount > rightCount ? 'LEFT' : 'RIGHT';
  let reason = `The sun is mostly on the ${side.toLowerCase()} side during your journey.`;

  if (sunriseSeen || sunsetSeen) {
    reason += ` You might also catch a ${sunriseSeen ? 'sunrise' : ''}${sunriseSeen && sunsetSeen ? ' and ' : ''}${sunsetSeen ? 'sunset' : ''}.`;
  }

  return {
    side,
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
