import { ArrowLeft, ArrowRight, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { SeatRecommendation } from "@/types/flight";

interface SeatRecommendationCardProps {
  recommendation: SeatRecommendation;
}

export function SeatRecommendationCard({ recommendation }: SeatRecommendationCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      className="relative sm:p-6 rounded-xl text-secondary bg-chart-3 shadow-lg shadow-foreground/30 w-full"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center">
        <div className="w-full sm:w-1/2 flex flex-col gap-2">
          <h3 className="text-xl sm:text-2xl font-semibold">
            Recommended Seat Side
          </h3>
          <motion.div
            className="flex items-center justify-start text-3xl sm:text-4xl font-bold"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {recommendation.side === "LEFT" ? (
              <>
                <ArrowLeft size={32} />
                <span>LEFT SIDE</span>
              </>
            ) : (
              <>
                <span>RIGHT SIDE</span>
                <ArrowRight size={32} />
              </>
            )}
          </motion.div>
        </div>

        <div className="w-full sm:w-1/2 flex flex-col gap-4">
          <div className="p-2 backdrop-blur-sm rounded-lg">
            <h4 className="font-bold mb-2">Best Views</h4>
            <ul className="list-disc list-inside font-medium">
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
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Sun size={80} />
      </motion.div>
    </motion.div>
  );
}
