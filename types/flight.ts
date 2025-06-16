export interface FlightDetails {
  source: string;
  destination: string;
  departureTime: string;
  duration: number;
  sunPreference: SunPreference
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
  sunrise?: {
    time: Date;
    location: { lat: number; lon: number; }
  };
  sunset?: {
    time: Date;
    location: { lat: number; lon: number; }
  };
}

export type SunPreference = {
  wantsSunrise: boolean;
  wantsSunset: boolean;
  priority: "SUNRISE" | "SUNSET" | null;
};
