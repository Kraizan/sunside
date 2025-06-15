import { Feature, LineString } from 'geojson';
import { Airport } from './airport';

export interface MapComponentProps {
  sourceAirport: Airport;
  destAirport: Airport;
  flightPath?: Feature<LineString>;
  startTime: Date;
  currentTime: Date;
  durationMinutes: number;
}

export interface FlightMapProps {
    sourceAirport: Airport;
    destAirport: Airport;
    flightPath?: Feature<LineString>;
    startTime: Date;
    currentTime: Date;
    durationMinutes: number;
    className?: string;
}
