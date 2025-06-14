import {
  FlightDetails,
  SeatRecommendation,
  SunPreference,
} from "@/types/flight";
import { Airport } from "@/types/airport";
import * as turf from "@turf/turf";
let SunCalc = require("suncalc3");
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function parseFlightDetails(
  searchParams: URLSearchParams
): FlightDetails & {
  sunPreference: SunPreference;
} {
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

export function getSunAzimuthAt(time: Date, coords: [number, number]): number {
  const sunPos = SunCalc.getPosition(time, coords[0], coords[1]);
  return ((sunPos.azimuth * 180) / Math.PI + 180) % 360;
}

export function recommendSide(
  flightDir: number,
  sunAzimuth: number
): "LEFT" | "RIGHT" {
  const relativeAngle = (sunAzimuth - flightDir + 360) % 360;
  if (relativeAngle === 0 || relativeAngle === 360 || relativeAngle === 180) {
    return "LEFT"; // default side when directly in front/back (could also be "NEUTRAL")
  }
  return relativeAngle > 0 && relativeAngle <= 180 ? "RIGHT" : "LEFT";
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
  const bearing = turf.bearing(sourceCoords, destCoords);

  const path = turf.lineString([sourceCoords, destCoords]);
  const length = turf.length(path);

  let leftCount = 0;
  let rightCount = 0;

  let sunriseEvent = null;
  let sunsetEvent = null;

  for (let i = 0; i <= duration; i += intervalMinutes) {
    const currentTime = new Date(departureTime.getTime() + i * 60 * 1000);
    const dist = (i / duration) * length;
    const [lon, lat] = turf.along(path, dist).geometry.coordinates;

    const azimuthDeg = getSunAzimuthAt(currentTime, [lat, lon]);

    const side = recommendSide(bearing, azimuthDeg);
    if (side === "LEFT") leftCount++;
    else rightCount++;

    // currentTime is a time within the flight
    const dateAtLocation = new Date(currentTime);
    dateAtLocation.setHours(12, 0, 0, 0); // Noon helps ensure it gets sunrise/sunset for *that* calendar day

    const times = SunCalc.getSunTimes(dateAtLocation, lat, lon, 0, false, true);

    // Now compare with currentTime as before
    const sunrise = {
      start: times.sunriseStart.value,
      end: times.sunriseEnd.value,
    };
    const sunset = {
      start: times.sunsetStart.value,
      end: times.sunsetEnd.value,
    };

    if (sunrise.start <= currentTime && sunrise.end >= currentTime) {
      sunriseEvent = { time: currentTime, location: { lat, lon } };
    }

    if (sunset.start <= currentTime && sunset.end >= currentTime) {
      sunsetEvent = { time: currentTime, location: { lat, lon } };
    }
  }

  // Determine side based on preferences
  let side: "LEFT" | "RIGHT";
  if (
    flightDetails.sunPreference.wantsSunrise &&
    sunriseEvent &&
    flightDetails.sunPreference.wantsSunset &&
    sunsetEvent
  ) {
    side =
      flightDetails.sunPreference.priority === "SUNRISE"
        ? recommendSide(
            bearing,
            getSunAzimuthAt(sunriseEvent.time, [
              sunriseEvent.location.lat,
              sunriseEvent.location.lon,
            ])
          )
        : recommendSide(
            bearing,
            getSunAzimuthAt(sunsetEvent.time, [
              sunsetEvent.location.lat,
              sunsetEvent.location.lon,
            ])
          );
  } else if (flightDetails.sunPreference.wantsSunrise && sunriseEvent) {
    side = recommendSide(
      bearing,
      getSunAzimuthAt(sunriseEvent.time, [
        sunriseEvent.location.lat,
        sunriseEvent.location.lon,
      ])
    );
  } else if (flightDetails.sunPreference.wantsSunset && sunsetEvent) {
    side = recommendSide(
      bearing,
      getSunAzimuthAt(sunsetEvent.time, [
        sunsetEvent.location.lat,
        sunsetEvent.location.lon,
      ])
    );
  } else {
    side = leftCount > rightCount ? "LEFT" : "RIGHT";
  }

  let reason = `The sun is mostly on the ${side.toLowerCase()} side during your journey.`;

  return {
    side,
    reason,
    sunrise: sunriseEvent
      ? { time: sunriseEvent.time, location: sunriseEvent.location }
      : undefined,
    sunset: sunsetEvent
      ? { time: sunsetEvent.time, location: sunsetEvent.location }
      : undefined,
  };
}

export function getSubsolarPoint(date: Date) {
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;

  // Convert a Date to number of days since J2000.0
  function toDays(date: Date): number {
    return date.getTime() / 86400000 - 10957.5;
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
    const C =
      rad *
      (1.9148 * Math.sin(M) +
        0.02 * Math.sin(2 * M) +
        0.0003 * Math.sin(3 * M));
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
    return ((((lon + 180) % 360) + 360) % 360) - 180;
  }

  const d = toDays(date);
  const { ra, dec } = sunCoords(d);
  const gst = siderealTime(d, 0); // Greenwich sidereal time in radians

  // Longitude = difference between RA and GST
  const lon = normalizeLongitude((ra - gst) * deg);
  const lat = dec * deg;

  return { lat, lon };
}
