import { SunEvent } from './sun';

export interface FlightDetails {
  source: string;
  destination: string;
  departureTime: string;
  duration: number;
}

export interface FormErrors {
  source?: string;
  destination?: string;
  departureTime?: string;
  duration?: string;
}

export interface VisibilityWindow {
  start: string;
  end: string;
  durationMinutes: number;
  sunriseEvents: SunEvent[];
  sunsetEvents: SunEvent[];
}

export interface SeatRecommendation {
  side: 'LEFT' | 'RIGHT';
  reason: string;
  visibilityWindow: VisibilityWindow;
}
