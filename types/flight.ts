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

export interface SeatRecommendation {
  side: 'LEFT' | 'RIGHT';
  reason: string;
}
