// components/HeroGlobe.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { GlobeMethods } from "react-globe.gl";

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// Airport definitions
type AirportMarker = {
  code: string;
  name: string;
  lat: number;
  lng: number;
};

type ArcData = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
};

// Hardcoded 5 airports
const AIRPORTS: AirportMarker[] = [
  { code: "BLR", name: "Bengaluru (BLR)", lat: 12.9716, lng: 77.5946 },
  { code: "BOS", name: "Boston (BOS)", lat: 42.3601, lng: -71.0589 },
  {
    code: "SVO",
    name: "Moscow Sheremetyevo (SVO)",
    lat: 55.9726,
    lng: 37.4146,
  },
  {
    code: "EZE",
    name: "Buenos Aires Ezeiza (EZE)",
    lat: -34.8222,
    lng: -58.5358,
  },
  { code: "DXB", name: "Dubai (DXB)", lat: 25.2532, lng: 55.3657 },
];

const DXB = AIRPORTS.find((airport) => airport.code === "DXB")!;

// Utility to pick random integer in [0, max)
function randomIndex(max: number): number {
  return Math.floor(Math.random() * max);
}

// Generate an array of random arcs between airports
function generateRandomFlights(count: number) {
  const arcs = [];
  const n = AIRPORTS.length;
  for (let i = 0; i < count; i++) {
    const a = randomIndex(n);
    let b = randomIndex(n);
    // ensure distinct endpoints
    while (b === a) {
      b = randomIndex(n);
    }
    const src = AIRPORTS[a];
    const dst = AIRPORTS[b];
    arcs.push({
      startLat: src.lat,
      startLng: src.lng,
      endLat: dst.lat,
      endLng: dst.lng,
    });
  }
  return arcs;
}

export function HeroGlobe() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [arcsData, setArcsData] = useState<ArcData[]>([]);

  // On mount, set up transparent background and initial flights
  useEffect(() => {
    // Initial random flights
    setArcsData(generateRandomFlights(10));

    // Periodically regenerate flights, e.g., every 10 seconds
    const interval = setInterval(() => {
      setArcsData(generateRandomFlights(10));
    }, 10_000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-1/2">
      <Globe
        ref={globeRef}
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg"
        width={800}
        height={800}
        backgroundColor="rgba(0,0,0,0)"
        // Airport markers as "points" or "labels"
        labelsData={AIRPORTS}
        labelLat={(d) => (d as AirportMarker).lat}
        labelLng={(d) => (d as AirportMarker).lng}
        labelText={(d) => (d as AirportMarker).code}
        labelSize={1.2}
        labelDotRadius={0.5}
        labelColor={() => "orange"}
        labelResolution={2}
        // Flight arcs
        arcsData={arcsData}
        arcStartLat={(d) => (d as ArcData).startLat}
        arcStartLng={(d) => (d as ArcData).startLng}
        arcEndLat={(d) => (d as ArcData).endLat}
        arcEndLng={(d) => (d as ArcData).endLng}
        arcColor={["lightblue", "deepskyblue"]}
        arcAltitude={0.25}
        arcStroke={0.5}
        arcDashLength={0.4}
        arcDashGap={0.6}
        arcDashInitialGap={1}
        arcDashAnimateTime={4000}
        // Optionally auto-rotate globe slowly
        animateIn={true}
        onGlobeReady={() => {
          if (globeRef.current) {
            try {
              globeRef.current.pointOfView(
                {
                  lat: DXB.lat,
                  lng: DXB.lng,
                  altitude: 2.5,
                },
                0
              ); // 0
              const controls = globeRef.current.controls();
              controls.autoRotate = true;
              controls.autoRotateSpeed = 0.3;
            } catch {
              // ignore
            }
          }
        }}
      />
    </div>
  );
}
