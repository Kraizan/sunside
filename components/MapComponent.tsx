"use client";

import { MapComponentProps } from "@/types/map";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, LatLngBounds } from "leaflet";
import { useState, useMemo } from "react";
import { SunSlider } from "./SunSlider";
import * as turf from "@turf/turf";
import { getSubsolarPoint } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const startIcon = new Icon({
  iconUrl: "/marker-start.png",
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

const endIcon = new Icon({
  iconUrl: "/marker-end.png",
  iconSize: [25, 25],
  iconAnchor: [13, 22],
});

const sunIcon = new Icon({
  iconUrl: "/sun-marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const customSunIcon = new Icon({
  iconUrl: "/sun-marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: 'sun' // Apply glow effect
});

export function MapComponent({
  sourceAirport,
  destAirport,
  flightPath,
  startTime,
  durationMinutes,
}: MapComponentProps) {
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [sunPosition, setSunPosition] = useState<[number, number] | null>(null);

  const updateSunPosition = (currentTime: Date) => {
    if (!currentPosition || !flightPath) return;

    // Get subsolar point (where sun is directly overhead)
    const { lat: sunLat, lon: sunLon } = getSubsolarPoint(currentTime);
    setSunPosition([sunLat, sunLon]);
  };

  const handleTimeChange = (currentTime: Date) => {
    if (!flightPath) return;

    // Calculate progress along path
    const elapsedMinutes = (currentTime.getTime() - startTime.getTime()) / 60000;
    const progress = elapsedMinutes / durationMinutes;
    
    // Get current position along the path
    const along = turf.along(flightPath, turf.length(flightPath) * progress, {
      units: 'kilometers'
    });
    
    setCurrentPosition([along.geometry.coordinates[1], along.geometry.coordinates[0]]);
    updateSunPosition(currentTime);
  };

  const bounds = useMemo(() => {
    return new LatLngBounds(
      [sourceAirport.location.lat, sourceAirport.location.lon],
      [destAirport.location.lat, destAirport.location.lon]
    );
  }, [sourceAirport, destAirport]);

  return (
    <motion.div 
      className="space-y-4 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MapContainer
        bounds={bounds}
        className="rounded-2xl shadow-lg h-[600px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[sourceAirport.location.lat, sourceAirport.location.lon]}
          icon={startIcon}
        >
          <Popup>{sourceAirport.fullName}</Popup>
        </Marker>

        <Marker
          position={[destAirport.location.lat, destAirport.location.lon]}
          icon={endIcon}
        >
          <Popup>{destAirport.fullName}</Popup>
        </Marker>

        {flightPath && (
          <Polyline
            positions={flightPath.geometry.coordinates.map(([lng, lat]) => [
              lat,
              lng,
            ])}
            pathOptions={{
              color: 'blue',
              weight: 3,
            }}
          />
        )}

        {currentPosition && (
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Marker
                position={currentPosition}
                icon={new Icon({
                  iconUrl: "/plane.png",
                  iconSize: [24, 24],
                  iconAnchor: [12, 12],
                })}
              />
            </motion.div>
          </AnimatePresence>
        )}

        {sunPosition && (
          <>
            <Marker position={sunPosition} icon={customSunIcon}>
              <Popup className="themed-popup">
                Subsolar Point<br/>
                Lat: {sunPosition[0].toFixed(2)}°<br/>
                Lon: {sunPosition[1].toFixed(2)}°
              </Popup>
            </Marker>
            {currentPosition && (
              <Polyline
                positions={[currentPosition, sunPosition]}
                pathOptions={{
                  color: 'var(--color-sunrise-500)',
                  dashArray: '4',
                  weight: 3
                }}
              />
            )}
          </>
        )}
      </MapContainer>

      <SunSlider
        durationMinutes={durationMinutes}
        startTime={startTime}
        onTimeChange={handleTimeChange}
      />
    </motion.div>
  );
}
