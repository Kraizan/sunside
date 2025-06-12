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
