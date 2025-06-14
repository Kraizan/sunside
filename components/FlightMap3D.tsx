'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { MeshLambertMaterial } from 'three';
import * as solar from 'solar-calculator';
import { Airport } from '@/types/airport';
import { Feature, LineString } from 'geojson';

// SSR-safe dynamic import
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

type FlightMap3DProps = {
  sourceAirport: Airport;
  destAirport: Airport;
  flightPath?: Feature<LineString>;
  startTime: Date;
  durationMinutes: number;
  className?: string;
};

const solarMaterial = new MeshLambertMaterial({
  color: '#ffff00',
  opacity: 0.25,
  transparent: true,
});

// Compute sun position (longitude, latitude) at a given timestamp
const sunPosAt = (dt: number): [number, number] => {
  const day = new Date(dt).setUTCHours(0, 0, 0, 0);
  const t = solar.century(dt);
  const longitude = ((day - dt) / 86400000) * 360 - 180;
  return [longitude - solar.equationOfTime(t) / 4, solar.declination(t)];
};

export default function FlightMap3D({
  sourceAirport,
  destAirport,
  flightPath,
  startTime,
  durationMinutes,
  className,
}: FlightMap3DProps) {
  const [dt, setDt] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 }); // Set default dimensions
  const containerRef = useRef<HTMLDivElement>(null);

  // Replace the existing resize observer effect with this updated version
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (!containerRef.current) return;
      // Get the parent element's width
      const parentWidth = containerRef.current.parentElement?.clientWidth || window.innerWidth;
      // Use the smaller of viewport width or parent width
      const width = Math.min(parentWidth, window.innerWidth);
      // Calculate height (using 0.67 for approximate 3:2 aspect ratio)
      const height = Math.floor(width * 0.67);
      
      setDimensions({ width, height });
    };

    // Initial size calculation
    updateDimensions();

    // Add window resize listener
    window.addEventListener('resize', updateDimensions);
    
    // Create resize observer for container
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const start = startTime.getTime();
    const end = start + durationMinutes * 60 * 1000;

    // Simulate flight time by advancing through flight duration
    let frame: number;
    let now = start;

    const animate = () => {
      now += 1000 * 60; // advance by 1 minute per frame
      if (now <= end) {
        setDt(now);
        frame = requestAnimationFrame(animate);
      }
    };

    setDt(start);
    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [startTime, durationMinutes]);

  if (!dt) return null;

  const sunPosition = sunPosAt(dt);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <Globe
        backgroundColor='rgba(0, 0, 0, 0)'
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
        // backgroundImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"

        // ☀️ Sun Overlay
        tilesData={[{ pos: sunPosition }]}
        tileLng={(d) => d.pos[0]}
        tileLat={(d) => d.pos[1]}
        tileAltitude={0.005}
        tileWidth={180}
        tileHeight={180}
        tileUseGlobeProjection={false}
        tileMaterial={() => solarMaterial}
        tilesTransitionDuration={0}

        // ✈️ Flight Arc
        arcsData={[
          {
            startLat: sourceAirport.location.lat,
            startLng: sourceAirport.location.lon,
            endLat: destAirport.location.lat,
            endLng: destAirport.location.lon,
            color: ['skyblue', 'deepskyblue'],
          },
        ]}
        arcStroke={0.8}
        arcAltitude={0.25}
        arcDashLength={1}
        arcDashGap={0}
        arcDashAnimateTime={4000}

        // 📍 Markers
        labelsData={[{ ...sourceAirport }, { ...destAirport }]}
        labelLat={(d) => (d as Airport).location.lat}
        labelLng={(d) => (d as Airport).location.lon}
        labelText={(d) => (d as Airport).fullName}
        labelSize={1.2}
        labelDotRadius={0.5}
        labelColor={() => 'skyblue'}
        labelResolution={2}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          color: 'lightblue',
          fontFamily: 'monospace',
        }}
      >
        {new Date(dt).toUTCString()}
      </div>
    </div>
  );
}
