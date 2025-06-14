"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MeshLambertMaterial } from "three";
import * as solar from "solar-calculator";

// Dynamically import Globe (SSR-safe)
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const VELOCITY = 0; // seconds per frame

const solarMaterial = new MeshLambertMaterial({
  color: "#ffff00",
  opacity: 0.25,
  transparent: true,
});

// Helper to compute sun position at given datetime
const sunPosAt = (dt: number): [number, number] => {
  const day = new Date(dt).setUTCHours(0, 0, 0, 0);
  const t = solar.century(dt);
  const longitude = ((day - dt) / 86400000) * 360 - 180;
  return [longitude - solar.equationOfTime(t) / 4, solar.declination(t)];
};

// Example airport coordinates
const sourceAirport = {
  name: "Delhi (DEL)",
  lat: 28.5562,
  lng: 77.1000,
};

const destAirport = {
  name: "London (LHR)",
  lat: 51.4700,
  lng: -0.4543,
};

export default function World() {
  const [dt, setDt] = useState<number | null>(null);

  // Animate time on client only
  useEffect(() => {
    setDt(Date.now());
    let animationFrame: number;

    const animateTime = () => {
      setDt((prev) => (prev ?? Date.now()) + VELOCITY * 1000);
      animationFrame = requestAnimationFrame(animateTime);
    };

    animationFrame = requestAnimationFrame(animateTime);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  if (!dt) return null;

  const sunPosition = sunPosAt(dt);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <Globe
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
        
        // 🌞 Sun Overlay
        tilesData={[{ pos: sunPosition }]}
        tileLng={(d) => d.pos[0]}
        tileLat={(d) => d.pos[1]}
        tileAltitude={0.005}
        tileWidth={180}
        tileHeight={180}
        tileUseGlobeProjection={false}
        tileMaterial={() => solarMaterial}
        tilesTransitionDuration={0}

        // ✈️ Flight path
        arcsData={[
          {
            startLat: sourceAirport.lat,
            startLng: sourceAirport.lng,
            endLat: destAirport.lat,
            endLng: destAirport.lng,
            color: ["lightblue", "deepskyblue"],
          },
        ]}
        arcStroke={0.5}
        arcAltitude={0.25}
        arcDashLength={0.4}
        arcDashInitialGap={1}
        arcDashAnimateTime={4000}

        // 📍 Airport markers
        labelsData={[sourceAirport, destAirport]}
        labelLat={(d) => d.lat}
        labelLng={(d) => d.lng}
        labelText={(d) => d.name}
        labelSize={1.2}
        labelDotRadius={0.5}
        labelColor={() => "skyblue"}
        labelResolution={2}
      />

      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: 8,
          color: "lightblue",
          fontFamily: "monospace",
        }}
      >
        {new Date(dt).toUTCString()}
      </div>
    </div>
  );
}
