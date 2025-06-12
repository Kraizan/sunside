export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
}

export const airports: Airport[] = [
  { iata: 'LHR', name: 'Heathrow', city: 'London', country: 'United Kingdom' },
  { iata: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
  { iata: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'United States' },
  { iata: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'United States' },
  { iata: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'United Arab Emirates' },
];
