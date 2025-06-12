export interface Airport {
  icao: string;
  iata: string;
  name: string;
  location: {
    lat: number;
    lon: number;
  };
  country: {
    code: string;
    name: string;
  };
  region: {
    code: string;
    name: string;
  };
  timeZone: string;
  elevation: number;
  municipality: string;
}
