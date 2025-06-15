import { Sunrise, Sunset } from "lucide-react";
import { motion } from "framer-motion";
import { SeatRecommendation } from "@/types/flight";

interface SunEventsProps {
  recommendation: SeatRecommendation;
}

export function SunEvents({ recommendation }: SunEventsProps) {
  return (
    <motion.div variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 }
    }} className="text-foreground">
      <h3 className="text-xl sm:text-3xl font-semibold mb-4 text-center text-chart-3">
        Sun Events
      </h3>
      {!recommendation.sunrise && !recommendation.sunset ? (
        <p className="text-center">
          You won't experience any sunrise or sunset during this flight.
        </p>
      ) : (
        <div className={`grid justify-between gap-4 ${recommendation.sunrise && recommendation.sunset ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {recommendation.sunrise && (
            <SunEventCard
              type="sunrise"
              time={recommendation.sunrise.time}
              location={recommendation.sunrise.location}
            />
          )}
          {recommendation.sunset && (
            <SunEventCard
              type="sunset"
              time={recommendation.sunset.time}
              location={recommendation.sunset.location}
            />
          )}
        </div>
      )}
    </motion.div>
  );
}

interface SunEventCardProps {
  type: 'sunrise' | 'sunset';
  time: Date;
  location: { lat: number; lon: number };
}

function SunEventCard({ type, time, location }: SunEventCardProps) {
  const Icon = type === 'sunrise' ? Sunrise : Sunset;
  const title = type === 'sunrise' ? 'Sunrise' : 'Sunset';

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      className="p-4 rounded-lg shadow-lg shadow-foreground/10 bg-card"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="" />
        <h4 className="font-medium text-2xl">{title}</h4>
      </div>
      <p className="text-xl font-bold">
        {time.toLocaleTimeString()}
      </p>
      <p className="">
        at {location.lat.toFixed(2)}°N,{" "}
        {location.lon.toFixed(2)}°E
      </p>
    </motion.div>
  );
}
