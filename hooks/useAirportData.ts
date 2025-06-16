import { useState, useEffect } from 'react';
import { Airport } from '@/types/airport';

interface AirportState {
  source: Airport | null;
  destination: Airport | null;
}

export function useAirportData(sourceCode: string, destinationCode: string) {
  const [state, setState] = useState<{
    airports: AirportState;
    loading: boolean;
    error: string | null;
  }>({
    airports: { source: null, destination: null },
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!sourceCode || !destinationCode) {
      setState(s => ({ ...s, loading: false }));
      return;
    }

    let mounted = true;
    
    Promise.all([
      fetch(`/api/airports/${sourceCode}`).then(res => res.json()),
      fetch(`/api/airports/${destinationCode}`).then(res => res.json())
    ])
      .then(([sourceData, destData]) => {
        if (!mounted) return;
        if ('error' in sourceData || 'error' in destData) {
          throw new Error('Could not find airport data');
        }
        setState({
          airports: {
            source: sourceData,
            destination: destData
          },
          loading: false,
          error: null
        });
      })
      .catch(err => {
        if (mounted) {
          setState({
            airports: { source: null, destination: null },
            loading: false,
            error: 'Failed to fetch airport data'
          });
        }
      });

    return () => { mounted = false; };
  }, [sourceCode, destinationCode]);

  return state;
}
