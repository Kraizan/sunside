import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MapErrorState() {
  return (
    <div className="w-3/5 h-[400px] bg-card/50 backdrop-blur-sm border border-destructive/20 rounded-lg shadow-lg flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-6 text-center max-w-[280px]">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">
            Map Loading Failed
          </h3>
          <p className="text-sm text-muted-foreground">
            We couldn't load the flight map. Please check your connection and try again.
          </p>
        </div>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    </div>
  );
}
