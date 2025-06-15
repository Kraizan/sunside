'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';
import { MapComponentProps, FlightMapProps } from '@/types/map';
import { MapLoadingState } from './loading-states/MapLoadingState';
import { MapErrorState } from './loading-states/MapErrorState';

const MapWithNoSSR = dynamic<MapComponentProps>(
  () => import('./MapComponent').then(mod => mod.MapComponent),
  { 
    loading: () => <MapLoadingState />
  }
);

export function FlightMap({ className, ...props }: FlightMapProps) {
  return (
    <ErrorBoundary FallbackComponent={MapErrorState}>
      <div className={className}>
        <MapWithNoSSR {...props} />
      </div>
    </ErrorBoundary>
  );
}