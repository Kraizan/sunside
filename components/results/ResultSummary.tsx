import { FlightDetails, SeatRecommendation } from "@/types/flight";
import { motion } from "framer-motion";
import { FlightHeader, SeatRecommendationCard, SunEvents, SunSlider } from ".";

interface ResultSummaryProps {
  flightDetails: FlightDetails;
  recommendation: SeatRecommendation;
  startTime: Date;
  durationMinutes: number;
  onTimeChange: (currentTime: Date) => void;
}

export function ResultSummary({
  flightDetails,
  recommendation,
  startTime,
  durationMinutes,
  onTimeChange,
}: ResultSummaryProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
      className="w-full xl:w-2/5 flex flex-col justify-start items-center px-4 py-8 m:px-6 lg:px-8 gap-8"
    >
      <FlightHeader flightDetails={flightDetails} />
      <SeatRecommendationCard recommendation={recommendation} />
      
      <motion.div variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }} className="w-full flex flex-col h-full gap-y-8">
        <SunEvents recommendation={recommendation} />
        <motion.div variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 }
        }} className="w-full text-foreground">
          <SunSlider
            durationMinutes={durationMinutes}
            startTime={startTime}
            onTimeChange={onTimeChange}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
