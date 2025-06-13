import { FlightDetails, SeatRecommendation, VisibilityWindow } from '@/types/flight';
import { SunEvent } from '@/types/sun';
import { Airport } from '@/types/airport';
import * as SunCalc from 'suncalc';
import { bearing } from '@turf/bearing';

export function getSunriseSunsetTimes(
  date: Date,
  coords: [number, number]
): VisibilityWindow {
  const times = SunCalc.getTimes(date, coords[0], coords[1]);
  const sunrise = times.sunrise;
  const sunset = times.sunset;

  return {
    start: sunrise.toISOString(),
    end: sunset.toISOString(),
    durationMinutes: Math.round((sunset.getTime() - sunrise.getTime()) / 60000),
    sunriseEvents: [
      { time: sunrise.toISOString(), location: {lat: coords[0], lon: coords[1]}, type: 'sunrise' }
    ],
    sunsetEvents: [
      { time: sunset.toISOString(), location: {lat: coords[0], lon: coords[1]}, type: 'sunset' }
    ]
  };
}

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
  const visibilityWindow = getSunriseSunsetTimes(departureTime, sourceCoords);

  const reason = `The sun will be on your ${recommendedSide.toLowerCase()} side during the flight, ` +
    `as you'll be flying towards ${Math.round(flightBearing)}° with the sun at ${Math.round(sunAzimuth)}°.`;

  return {
    side: recommendedSide,
    reason,
    visibilityWindow
  };
}

export function checkSunEventsAtPoint(
  date: Date,
  coords: [number, number],
  toleranceMinutes: number = 15
): SunEvent[] {
  const times = SunCalc.getTimes(date, coords[0], coords[1]);
  const events: SunEvent[] = [];
  const tolerance = toleranceMinutes * 60 * 1000; // convert to milliseconds
  const flightTime = date.getTime();

  console.log(`Checking sun events at ${date.toISOString()} for coords ${coords}`);
  console.log(`Sunrise: ${times.sunrise.toISOString()}, Sunset: ${times.sunset.toISOString()}`);
  console.log(`Flight time: ${new Date(flightTime).toISOString()}, Tolerance: ${toleranceMinutes} minutes`);
  console.log(`Sunrise time: ${times.sunrise.getTime()}, Sunset time: ${times.sunset.getTime()}`);
  console.log(`Flight time: ${flightTime}`);
  console.log(`Tolerance in ms: ${tolerance}`);
  console.log(`Sunrise diff: ${Math.abs(times.sunrise.getTime() - flightTime)}`);
  console.log(`Sunset diff: ${Math.abs(times.sunset.getTime() - flightTime)}`);

  if (Math.abs(times.sunrise.getTime() - flightTime) <= tolerance) {
    events.push({
      time: times.sunrise.toISOString(),
      location: { lat: coords[0], lon: coords[1] },
      type: 'sunrise'
    });
  }

  if (Math.abs(times.sunset.getTime() - flightTime) <= tolerance) {
    events.push({
      time: times.sunset.toISOString(),
      location: { lat: coords[0], lon: coords[1] },
      type: 'sunset'
    });
  }

  return events;
}