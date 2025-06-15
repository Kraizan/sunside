import { useEffect, useState } from 'react';

export function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);
  
  const messages = [
    "Consulting with the sun gods for the perfect seat...",
    "Checking if window seats have better views today...",
    "Calculating optimal napping positions...",
    "Measuring sunlight angles for maximum comfort...",
    "Analyzing cloud formations along your route...",
    "Asking birds for their flight recommendations...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % messages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 px-4">
      <div className="relative">
        <div className="absolute inset-0 bg-chart-3/30 blur-xl rounded-full animate-pulse"></div>
        <div className="relative animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-chart-3"></div>
      </div>
      
      <p className="text-lg text-center font-medium text-muted-foreground animate-fade">
        {messages[messageIndex]}
      </p>
    </div>
  );
}
