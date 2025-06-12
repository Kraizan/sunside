import { Feature, LineString } from 'geojson';
import { Airport } from './airport';
import { SunEvent } from './flight';

export interface MapComponentProps {
  sourceAirport: Airport;
  destAirport: Airport;
  flightPath?: Feature<LineString>;
  sunEvents?: SunEvent[];
}

export interface FlightMapProps {
    sourceAirport: Airport;
    destAirport: Airport;
    flightPath?: Feature<LineString>;
    sunEvents?: SunEvent[];
    className?: string;
  }
  