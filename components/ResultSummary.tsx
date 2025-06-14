import { FlightDetails, SeatRecommendation } from '@/types/flight';
import { motion } from 'framer-motion';
import { Plane, ArrowLeft, ArrowRight, Sun, Sunrise, Sunset } from 'lucide-react';

interface ResultSummaryProps {
  flightDetails: FlightDetails;
  recommendation: SeatRecommendation;
}

export default function ResultSummary({ flightDetails, recommendation }: ResultSummaryProps) {
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
      <motion.div variants={item} className="card mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <motion.h2 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-sunset dark:text-gradient-sunrise inline-flex items-center gap-2"
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
          className="relative overflow-hidden sm:p-8 rounded-xl bg-gradient-sunset text-white"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="w-full sm:w-1/2">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">Recommended Seat Side</h3>
              <motion.div 
                className="flex items-center justify-center gap-4 text-3xl sm:text-4xl font-bold"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {recommendation.side === 'LEFT' ? (
                  <><ArrowLeft size={32} /><span>LEFT SIDE</span></>
                ) : (
                  <><span>RIGHT SIDE</span><ArrowRight size={32} /></>
                )}
              </motion.div>
              <p className="mt-4 text-white/80">{recommendation.reason}</p>
            </div>
            
            <div className="w-full sm:w-1/2 flex flex-col gap-4">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <h4 className="font-medium mb-2">Best Views</h4>
                <ul className="list-disc list-inside text-foreground/80">
                  <li>Optimal sunset/sunrise viewing</li>
                  <li>Scenic landscape opportunities</li>
                  <li>Better photography angles</li>
                </ul>
              </div>
            </div>
          </div>
          
          <motion.div 
            className="absolute top-4 right-4 opacity-20"
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

      <motion.div variants={item} className="card mt-8">
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
                className="p-4 bg-primary-100 dark:bg-primary rounded-lg transition-colors hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sunrise className="text-primary-500" />
                  <h4 className="font-medium text-2xl">Sunrise</h4>
                </div>
                <p className='text-xl font-bold'>{recommendation.sunrise.time.toLocaleTimeString()}</p>
                <p className="text-muted-foreground">
                  at {recommendation.sunrise.location.lat.toFixed(2)}°N, {recommendation.sunrise.location.lon.toFixed(2)}°E
                </p>
              </motion.div>
            )}
            {recommendation.sunset && (
              <motion.div 
                variants={item}
                className="p-4 bg-primary-100 dark:bg-primary rounded-lg transition-colors hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sunset className="text-primary-500" />
                  <h4 className="font-medium text-2xl">Sunset</h4>
                </div>
                <p className='text-xl font-bold'>{recommendation.sunset.time.toLocaleTimeString()}</p>
                <p className="text-muted-foreground">
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