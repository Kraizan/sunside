import { useState, useEffect } from 'react';
import { Airport } from '@/types/airport';

interface AirportState {
  source: Airport | null;
  destination: Airport | null;
}

interface UseAirportDataReturn {
  airports: AirportState;
  loading: boolean;
  error: string | null;
}

export function useAirportData(sourceCode: string, destinationCode: string): UseAirportDataReturn {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [airports, setAirports] = useState<AirportState>({
    source: null,
    destination: null
  });

  useEffect(() => {
    async function fetchAirportData() {
      try {
        const [sourceData, destData] = await Promise.all([
          fetch(`/api/airports/${sourceCode}`).then(res => res.json()),
          fetch(`/api/airports/${destinationCode}`).then(res => res.json())
        ]);

        if ('error' in sourceData || 'error' in destData) {
          throw new Error('Could not find airport data');
        }

        setAirports({
          source: sourceData as Airport,
          destination: destData as Airport
        });

      } catch (err) {
        setError('Failed to fetch airport data');
        console.error('Error fetching airport data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (sourceCode && destinationCode) {
      fetchAirportData();
    }
  }, [sourceCode, destinationCode]);

  return { airports, loading, error };
}
