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

export function parseFlightDetails(params: URLSearchParams): FlightDetails {
  return {
    source: params.get('source') || '',
    destination: params.get('destination') || '',
    departureTime: params.get('departureTime') || '',
    duration: Number(params.get('duration')) || 0,
  };
}