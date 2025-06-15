import { FlightDetails, SeatRecommendation } from '@/types/flight';
import { motion } from 'framer-motion';
import { Plane, ArrowLeft, ArrowRight, Sun, Sunrise, Sunset } from 'lucide-react';
import { SunSlider } from './SunSlider';

interface ResultSummaryProps {
  flightDetails: FlightDetails;
  recommendation: SeatRecommendation;
  startTime: Date;
  durationMinutes: number;
  onTimeChange: (currentTime: Date) => void;
}

export default function ResultSummary({ 
  flightDetails, 
  recommendation,
  startTime,
  durationMinutes,
  onTimeChange
}: ResultSummaryProps) {
  const formattedDate = new Date(flightDetails.departureTime).toLocaleString();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="w-2/5 mx-auto px-4 sm:px-6 lg:px-8"
    >
      <motion.div variants={item} className="mb-8">
        <SunSlider
          durationMinutes={durationMinutes}
          startTime={startTime}
          onTimeChange={onTimeChange}
        />
      </motion.div>

      <motion.div variants={item} className="card mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <motion.h2 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary inline-flex items-center gap-2"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>{flightDetails.source}</span>
            <Plane className="inline rotate-90" />
            <span>{flightDetails.destination}</span>
          </motion.h2>
        </div>

        <div className="flex justify-between gap-4 mb-2 text-xl">
          <motion.div variants={item} className="p-2 rounded-lg">
            <div className="text-muted-foreground">Departure</div>
            <div className="font-medium">{formattedDate}</div>
          </motion.div>
          <motion.div variants={item} className="p-2 rounded-lg">
            <div className="text-muted-foreground">Duration</div>
            <div className="font-medium">{Math.round(flightDetails.duration)} minutes</div>
          </motion.div>
        </div>

        <motion.div 
          variants={item}
          className="relative overflow-hidden sm:p-2 rounded-xl bg-gradient-sunset text-primary"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-chart-3">
            <div className="w-full sm:w-1/2">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">Recommended Seat Side</h3>
              <motion.div 
                className="flex items-center justify-center gap-4 text-3xl sm:text-4xl font-bold text-chart-3"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {recommendation.side === 'LEFT' ? (
                  <><ArrowLeft size={32} /><span>LEFT SIDE</span></>
                ) : (
                  <><span>RIGHT SIDE</span><ArrowRight size={32} /></>
                )}
              </motion.div>
              <p className="mt-4 text-primary">{recommendation.reason}</p>
            </div>
            
            <div className="w-full sm:w-1/2 flex flex-col gap-4">
              <div className="p-4 backdrop-blur-sm rounded-lg">
                <h4 className="font-bold mb-2 text-secondary">Best Views</h4>
                <ul className="list-disc list-inside text-secondary font-medium">
                  <li>Optimal sunset/sunrise viewing</li>
                  <li>Scenic landscape opportunities</li>
                  <li>Better photography angles</li>
                </ul>
              </div>
            </div>
          </div>
          
          <motion.div 
            className="absolute top-4 right-4 opacity-50 text-primary"
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Sun size={80} />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div variants={item} className="mt-8">
        <h3 className="text-xl sm:text-3xl font-semibold mb-4 text-center">Sun Events</h3>
        {(!recommendation.sunrise && !recommendation.sunset) ? (
          <p className="text-muted-foreground">
            You won't experience any sunrise or sunset during this flight.
          </p>
        ) : (
          <div className="flex justify-between gap-4">
            {recommendation.sunrise && (
              <motion.div 
                variants={item}
                className="p-4 bg-chart-3 rounded-lg hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2 mb-2 text-secondary">
                  <Sunrise className="text-secondary" />
                  <h4 className="font-medium text-2xl">Sunrise</h4>
                </div>
                <p className='text-xl font-bold text-secondary'>{recommendation.sunrise.time.toLocaleTimeString()}</p>
                <p className="text-secondary">
                  at {recommendation.sunrise.location.lat.toFixed(2)}°N, {recommendation.sunrise.location.lon.toFixed(2)}°E
                </p>
              </motion.div>
            )}
            {recommendation.sunset && (
              <motion.div 
                variants={item}
                className="p-4 bg-chart-3 rounded-lg hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2 mb-2 text-secondary">
                  <Sunset className="text-secondary" />
                  <h4 className="font-medium text-2xl">Sunset</h4>
                </div>
                <p className='text-xl font-bold text-secondary'>{recommendation.sunset.time.toLocaleTimeString()}</p>
                <p className="text-secondary">
                  at {recommendation.sunset.location.lat.toFixed(2)}°N, {recommendation.sunset.location.lon.toFixed(2)}°E
                </p>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}