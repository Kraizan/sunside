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
import { useMemo } from "react";

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

export function MapComponent({
  sourceAirport,
  destAirport,
  flightPath,
  sunEvents,
}: MapComponentProps) {
  const bounds = useMemo(() => {
    return new LatLngBounds(
      [sourceAirport.location.lat, sourceAirport.location.lon],
      [destAirport.location.lat, destAirport.location.lon]
    );
  }, [sourceAirport, destAirport]);

  return (
    <MapContainer
      bounds={bounds}
      style={{ height: "400px", width: "100%" }}
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
        <Popup>{sourceAirport.name}</Popup>
      </Marker>

      <Marker
        position={[destAirport.location.lat, destAirport.location.lon]}
        icon={endIcon}
      >
        <Popup>{destAirport.name}</Popup>
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
    </MapContainer>
  );
}
