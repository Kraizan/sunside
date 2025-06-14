"use client";

import { MapComponentProps } from "@/types/map";
import {
  useMap,
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { Icon, LatLngBounds } from "leaflet";
import { useState, useMemo, useEffect } from "react";
import { SunSlider } from "./SunSlider";
import * as turf from "@turf/turf";
import { getSubsolarPoint } from '@/lib/utils';

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
    <div className="space-y-4">
      <MapContainer
        bounds={bounds}
        style={{ height: "600px", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
            color="#0066cc"
          />
        )}

        {currentPosition && (
          <Marker
            position={currentPosition}
            icon={new Icon({
              iconUrl: "/plane.png",
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })}
          />
        )}

        {sunPosition && (
          <>
            <Marker position={sunPosition} icon={sunIcon}>
              <Popup>
                Subsolar Point<br/>
                Lat: {sunPosition[0].toFixed(2)}°<br/>
                Lon: {sunPosition[1].toFixed(2)}°
              </Popup>
            </Marker>
            {currentPosition && (
              <Polyline
                positions={[currentPosition, sunPosition]}
                color="#FFD700"
                dashArray="5,10"
                opacity={0.6}
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
    </div>
  );
}
