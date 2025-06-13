import { Feature, LineString } from 'geojson';
import { Airport } from './airport';
import { SunEvent } from './sun';

export interface MapComponentProps {
  sourceAirport: Airport;
  destAirport: Airport;
  flightPath?: Feature<LineString>;
}

export interface FlightMapProps {
    sourceAirport: Airport;
    destAirport: Airport;
    flightPath?: Feature<LineString>;
    className?: string;
  }
  