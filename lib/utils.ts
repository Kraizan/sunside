import {
  FlightDetails,
  SeatRecommendation,
  SunPreference,
} from "@/types/flight";
import { Airport } from "@/types/airport";
import * as turf from "@turf/turf";
import SunCalc from "suncalc3";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseFlightDetails(
  searchParams: URLSearchParams
): FlightDetails & { sunPreference: SunPreference } {
  const source = searchParams.get("source") || "";
  const destination = searchParams.get("destination") || "";
  const departureTime =
    searchParams.get("departureTime") || new Date().toISOString();
  const duration = parseInt(searchParams.get("duration") || "0", 10);
  return {
    source,
    destination,
    departureTime: new Date(departureTime).toISOString(),
    duration: isNaN(duration) ? 0 : duration,
    sunPreference: {
      wantsSunrise: searchParams.get("wantsSunrise") === "true",
      wantsSunset: searchParams.get("wantsSunset") === "true",
      priority:
        (searchParams.get("priority") as "SUNRISE" | "SUNSET" | null) || null,
    },
  };
}

export function getSubsolarPoint(date: Date) {
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;

  function toDays(d: Date): number {
    return d.getTime() / 86400000 - 10957.5;
  }
  function solarMeanAnomaly(d: number): number {
    return rad * (357.5291 + 0.98560028 * d);
  }
  function eclipticLongitude(M: number): number {
    const C =
      rad *
      (1.9148 * Math.sin(M) +
        0.02 * Math.sin(2 * M) +
        0.0003 * Math.sin(3 * M));
    const P = rad * 102.9372;
    return M + C + P + Math.PI;
  }
  function sunCoords(dDays: number) {
    const M = solarMeanAnomaly(dDays);
    const L = eclipticLongitude(M);
    const dec = Math.asin(
      Math.sin(L) * Math.sin(0) + Math.cos(L) * Math.cos(0) * Math.sin(L) * 0
    );
    const ra = Math.atan2(Math.sin(L) * Math.cos(0), Math.cos(L));
    return { dec, ra };
  }
  function siderealTime(dDays: number): number {
    return rad * (280.16 + 360.9856235 * dDays);
  }
  function normalizeLon(lon: number): number {
    return ((((lon + 180) % 360) + 360) % 360) - 180;
  }

  const dDays = toDays(date);
  const { ra, dec } = sunCoords(dDays);
  const gst = siderealTime(dDays);
  const lon = normalizeLon((ra * deg - gst * deg) % 360);
  const lat = dec * deg;
  return { lat, lon };
}

function recommendSideByLonAngle(
  flightCoords: [number, number],
  destCoords: [number, number],
  time: Date
): "LEFT" | "RIGHT" {
  const sub = getSubsolarPoint(time);

  const bearingToDest = turf.bearing(
    turf.point(flightCoords),
    turf.point(destCoords)
  );

  const bearingToSun = turf.bearing(
    turf.point(flightCoords),
    turf.point([sub.lon, sub.lat])
  );

  // Calculate shortest clockwise angle difference [-180, +180]
  const angleDiff = ((bearingToSun - bearingToDest + 540) % 360) - 180;

  return angleDiff > 0 ? "RIGHT" : "LEFT";
}

export function generateAdvancedRecommendation(
  flightDetails: FlightDetails & { sunPreference: SunPreference },
  sourceAirport: Airport,
  destAirport: Airport
): SeatRecommendation {
  const departureTime = new Date(flightDetails.departureTime);
  const duration = flightDetails.duration;
  const intervalMinutes = 1;
  const sourceCoords: [number, number] = [
    sourceAirport.location.lon,
    sourceAirport.location.lat,
  ];
  const destCoords: [number, number] = [
    destAirport.location.lon,
    destAirport.location.lat,
  ];

  const path = turf.lineString([sourceCoords, destCoords]);
  const totalLength = turf.length(path);

  let leftCount = 0;
  let rightCount = 0;
  let sunriseEvent: {
    time: Date;
    location: { lat: number; lon: number };
  } | null = null;
  let sunsetEvent: {
    time: Date;
    location: { lat: number; lon: number };
  } | null = null;

  for (let i = 0; i <= duration; i += intervalMinutes) {
    const currentTime = new Date(departureTime.getTime() + i * 60 * 1000);
    const distAlong = (i / (duration || 1)) * totalLength;
    const coord = turf.along(path, distAlong).geometry.coordinates as [
      number,
      number
    ];

    const side = recommendSideByLonAngle(coord, destCoords, currentTime);
    if (side === "LEFT") leftCount++;
    else rightCount++;

    const [lon, lat] = coord;
    const dateAtLocation = new Date(currentTime);
    dateAtLocation.setHours(12, 0, 0, 0);
    const times = SunCalc.getSunTimes(dateAtLocation, lat, lon, 0, false, true);
    const sunrise = {
      start: new Date(times.sunriseStart.value.getTime() - 5 * 60 * 1000),
      end: new Date(times.sunriseEnd.value.getTime() + 5 * 60 * 1000),
    };
    const sunset = {
      start: new Date(times.sunsetStart.value.getTime() - 5 * 60 * 1000),
      end: new Date(times.sunsetEnd.value.getTime() + 5 * 60 * 1000),
    };

    if (sunrise.start <= currentTime && sunrise.end >= currentTime) {
      sunriseEvent = { time: currentTime, location: { lat, lon } };
    }
    if (sunset.start <= currentTime && sunset.end >= currentTime) {
      sunsetEvent = { time: currentTime, location: { lat, lon } };
    }
  }

  let finalSide: "LEFT" | "RIGHT";
  if (
    flightDetails.sunPreference.wantsSunrise &&
    sunriseEvent &&
    flightDetails.sunPreference.wantsSunset &&
    sunsetEvent
  ) {
    const useEvent =
      flightDetails.sunPreference.priority === "SUNRISE"
        ? sunriseEvent
        : sunsetEvent;
    finalSide = recommendSideByLonAngle(
      [useEvent.location.lon, useEvent.location.lat],
      destCoords,
      useEvent.time
    );
  } else if (flightDetails.sunPreference.wantsSunrise && sunriseEvent) {
    finalSide = recommendSideByLonAngle(
      [sunriseEvent.location.lon, sunriseEvent.location.lat],
      destCoords,
      sunriseEvent.time
    );
  } else if (flightDetails.sunPreference.wantsSunset && sunsetEvent) {
    finalSide = recommendSideByLonAngle(
      [sunsetEvent.location.lon, sunsetEvent.location.lat],
      destCoords,
      sunsetEvent.time
    );
  } else {
    finalSide = leftCount > rightCount ? "LEFT" : "RIGHT";
  }

  const reason = `The sun is mostly on the ${finalSide.toLowerCase()} side during your journey.`;
  return {
    side: finalSide,
    reason,
    sunrise: sunriseEvent
      ? { time: sunriseEvent.time, location: sunriseEvent.location }
      : undefined,
    sunset: sunsetEvent
      ? { time: sunsetEvent.time, location: sunsetEvent.location }
      : undefined,
  };
}
