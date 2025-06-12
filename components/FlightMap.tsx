'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';
import { MapComponentProps, FlightMapProps } from '@/types/map';

const MapWithNoSSR = dynamic<MapComponentProps>(
  () => import('./MapComponent').then(mod => mod.MapComponent),
  { 
    loading: () => <MapLoadingState />
  }
);

function MapLoadingState() {
  return (
    <div className="w-full h-[400px] bg-muted/20 animate-pulse rounded-lg flex items-center justify-center text-muted-foreground">
      Loading map...
    </div>
  );
}

function MapErrorState() {
  return (
    <div className="w-full h-[400px] bg-destructive/10 rounded-lg flex items-center justify-center text-destructive">
      Failed to load map
    </div>
  );
}

export function FlightMap({ className, ...props }: FlightMapProps) {
  return (
    <ErrorBoundary FallbackComponent={MapErrorState}>
      <div className={className}>
        <MapWithNoSSR {...props} />
      </div>
    </ErrorBoundary>
  );
}
