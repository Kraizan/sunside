'use client';

import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useState, useRef } from 'react';

interface SunSliderProps {
  durationMinutes: number;
  startTime: Date;
  onTimeChange: (currentTime: Date) => void;
}

export function SunSlider({ durationMinutes, startTime, onTimeChange }: SunSliderProps) {
  const [currentMinute, setCurrentMinute] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const percent = (currentMinute / (durationMinutes - 1)) * 100;

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
    <div className="w-2/3 bg-card shadow-lg rounded-lg p-6 space-y-4 mx-auto">
      <div className="flex justify-between text-sm text-muted-foreground items-center">
        <div className="flex items-center gap-2">
          <SunIcon className="h-4 w-4 text-sunrise-500" fill='yellow'/>
          <span>{formatTime(0)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{formatTime(durationMinutes)}</span>
          <MoonIcon className="h-4 w-4" fill='white'/>
        </div>
      </div>
      
      <div className="relative" ref={sliderRef}>
        <motion.div 
          className="time-bubble"
          style={{ left: `${percent}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {formatTime(currentMinute)}
        </motion.div>
        <input
          type="range"
          min="0"
          max={durationMinutes - 1}
          value={currentMinute}
          onChange={handleSliderChange}
          className="w-full h-1 rounded-full cursor-pointer"
        />
      </div>
    </div>
  );
}
