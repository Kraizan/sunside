export interface SunPosition {
  azimuth: number;
  altitude: number;
}

export interface SunEvent {
  time: string;
  location:{
    lat: number;
    lon: number;
  };
  type: 'sunrise' | 'sunset';
}
