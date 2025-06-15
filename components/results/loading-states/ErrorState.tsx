import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <div className="mx-auto rounded-full bg-destructive/10 p-4 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-center">
            Something went wrong
          </h3>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground text-center">
            {error}
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-center pb-6">
          <Button 
            onClick={() => window.location.reload()}
            className="bg-chart-3 hover:bg-chart-3/90 text-white font-medium"
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
