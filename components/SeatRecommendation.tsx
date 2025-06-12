import { SeatRecommendation } from '@/types/flight';
import { motion } from 'framer-motion';

interface SeatRecommendationProps {
  recommendation: SeatRecommendation;
}

export function SeatRecommendationCard({ recommendation }: SeatRecommendationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white rounded-lg shadow-lg"
    >
      <h3 className="text-lg font-semibold mb-2">
        Recommended Seat: {recommendation.side.toLowerCase()} side
      </h3>
      <p className="text-gray-600">{recommendation.reason}</p>
      
      {recommendation.visibilityWindow && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Special Events</h4>
          {recommendation.visibilityWindow.sunriseEvents.map((event, idx) => (
            <div key={`sunrise-${idx}`} className="flex items-center gap-2">
              <span>🌅</span>
              <span>Sunrise at {event.time}</span>
            </div>
          ))}
          {recommendation.visibilityWindow.sunsetEvents.map((event, idx) => (
            <div key={`sunset-${idx}`} className="flex items-center gap-2">
              <span>🌇</span>
              <span>Sunset at {event.time}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
