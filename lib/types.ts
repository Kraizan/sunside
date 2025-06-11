// Flight form input types
export interface FlightDetails {
  source: string;
  destination: string;
  departureTime: string;
  duration: number;
}

// Form validation types
export interface FormErrors {
  source?: string;
  destination?: string;
  departureTime?: string;
  duration?: string;
}