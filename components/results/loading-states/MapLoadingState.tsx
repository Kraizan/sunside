import { Plane } from 'lucide-react';

export function MapLoadingState() {
  return (
    <div className="w-full h-[400px] bg-gradient-to-br from-background to-background/50 border rounded-lg shadow-lg flex flex-col gap-4 items-center justify-center overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-chart-3 to-transparent"></div>
        </div>
        <Plane className="h-8 w-8 text-chart-3 relative animate-fly" />
      </div>
      <p className="text-muted-foreground text-sm animate-pulse">
        Charting your flight path...
      </p>
    </div>
  );
}
