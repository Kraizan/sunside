export interface SunPosition {
  azimuth: number;
  altitude: number;
}

export interface SunEvent {
  time: string;
  location: [number, number];
  type: 'sunrise' | 'sunset';
}
