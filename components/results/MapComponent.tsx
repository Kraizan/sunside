"use client";

import { MapComponentProps } from "@/types/map";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngBounds } from "leaflet";
import { useState, useMemo, useEffect } from "react";
import * as turf from "@turf/turf";
import { getSubsolarPoint } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { createPlaneIcon, StartIcon, EndIcon, SunIcon } from "@/lib/map-icons";

export function MapComponent({
  sourceAirport,
  destAirport,
  flightPath,
  startTime,
  durationMinutes,
  currentTime,
}: MapComponentProps) {
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);
  const [sunPosition, setSunPosition] = useState<[number, number] | null>(null);
  const [planeRotation, setPlaneRotation] = useState(0);

  useEffect(() => {
    if (!flightPath) return;

    const elapsedMinutes =
      (currentTime.getTime() - startTime.getTime()) / 60000;
    const progress = elapsedMinutes / durationMinutes;

    const along = turf.along(flightPath, turf.length(flightPath) * progress, {
      units: "kilometers",
    });

    setCurrentPosition([
      along.geometry.coordinates[1],
      along.geometry.coordinates[0],
    ]);

    const { lat: sunLat, lon: sunLon } = getSubsolarPoint(currentTime);
    setSunPosition([sunLat, sunLon]);

  }, [currentTime, flightPath, durationMinutes, startTime]);

  useEffect(() => {
    if (!flightPath) return;
  
    const start = turf.along(flightPath, 0, { units: "kilometers" });
    const next = turf.along(flightPath, 0.01, { units: "kilometers" });
  
    const bearing = turf.bearing(start, next);
    setPlaneRotation(bearing);
  }, [flightPath]);

  const bounds = useMemo(() => {
    return new LatLngBounds(
      [sourceAirport.location.lat, sourceAirport.location.lon],
      [destAirport.location.lat, destAirport.location.lon]
    );
  }, [sourceAirport, destAirport]);

  return (
    <motion.div className="h-full w-full rounded-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <MapContainer bounds={bounds} className="h-[calc(100vh-6rem)] w-full rounded-xl">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[sourceAirport.location.lat, sourceAirport.location.lon]} icon={StartIcon}>
          <Popup>{sourceAirport.fullName}</Popup>
        </Marker>

        <Marker position={[destAirport.location.lat, destAirport.location.lon]} icon={EndIcon}>
          <Popup>{destAirport.fullName}</Popup>
        </Marker>

        {flightPath && (
          <Polyline
            positions={(
              flightPath.geometry.coordinates as [number, number][]
            ).map(([lng, lat]) => [lat, lng])}
            pathOptions={{
              color: "blue",
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
                icon={createPlaneIcon(planeRotation)}
              />
            </motion.div>
          </AnimatePresence>
        )}

        {sunPosition && (
          <>
            <Marker position={sunPosition} icon={SunIcon}>
              <Popup className="themed-popup">
                Subsolar Point
                <br />
                Lat: {sunPosition[0].toFixed(2)}°<br />
                Lon: {sunPosition[1].toFixed(2)}°
              </Popup>
            </Marker>
            {currentPosition && (
              <Polyline
                positions={[currentPosition, sunPosition]}
                pathOptions={{
                  color: "var(--sunicon)",
                  dashArray: "4",
                  weight: 3,
                }}
              />
            )}
          </>
        )}
      </MapContainer>
    </motion.div>
  );
}
