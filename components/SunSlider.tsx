'use client';

import { useState } from 'react';

interface SunSliderProps {
  durationMinutes: number;
  startTime: Date;
  onTimeChange: (currentTime: Date) => void;
}

export function SunSlider({ durationMinutes, startTime, onTimeChange }: SunSliderProps) {
  const [currentMinute, setCurrentMinute] = useState(0);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minute = parseInt(e.target.value);
    setCurrentMinute(minute);
    const newTime = new Date(startTime.getTime() + minute * 60000);
    onTimeChange(newTime);
  };

  const formatTime = (minute: number) => {
    const time = new Date(startTime.getTime() + minute * 60000);
    return time.toLocaleTimeString();
  };

  return (
    <div className="bg-card shadow-lg rounded-lg p-4 space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{formatTime(0)}</span>
        <span>{formatTime(durationMinutes)}</span>
      </div>
      <input
        type="range"
        min="0"
        max={durationMinutes - 1}
        value={currentMinute}
        onChange={handleSliderChange}
        className="w-full accent-primary"
      />
      <div className="text-center text-sm font-mono">
        Current Time: {formatTime(currentMinute)}
      </div>
    </div>
  );
}
