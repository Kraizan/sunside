import { Plane } from "lucide-react";
import { motion } from "framer-motion";
import { FlightDetails } from "@/types/flight";

interface FlightHeaderProps {
  flightDetails: FlightDetails;
}

export function FlightHeader({ flightDetails }: FlightHeaderProps) {
  const formattedDate = new Date(flightDetails.departureTime).toLocaleString();

  return (
    <motion.div variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 }
    }} className="flex flex-col items-center gap-4 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <motion.h2
          className="text-5xl font-bold text-primary inline-flex items-center gap-2"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span>{flightDetails.source}</span>
          <Plane className="inline" />
          <span>{flightDetails.destination}</span>
        </motion.h2>
      </div>

      <div className="flex justify-between gap-4 mb-2 text-xl w-full">
        <motion.div variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 }
        }} className="p-2 rounded-lg">
          <div className="text-muted-foreground">Departure</div>
          <div className="font-medium">{formattedDate}</div>
        </motion.div>
        <motion.div variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 }
        }} className="p-2 rounded-lg">
          <div className="text-muted-foreground">Duration</div>
          <div className="font-medium">
            {Math.round(flightDetails.duration)} minutes
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
