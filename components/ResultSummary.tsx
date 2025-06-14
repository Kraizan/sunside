import { FlightDetails, SeatRecommendation } from '@/types/flight';

interface ResultSummaryProps {
  flightDetails: FlightDetails;
  recommendation: SeatRecommendation;
}

export default function ResultSummary({ flightDetails, recommendation }: ResultSummaryProps) {
  const formattedDate = new Date(flightDetails.departureTime).toLocaleString();

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-card shadow-lg">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2 text-gradient-sunrise">Your Flight Summary</h2>
        <div className="text-lg text-gray-600">
          {flightDetails.source} → {flightDetails.destination}
        </div>
      </div>
      
      <div className="mb-8 space-y-4">
        <div className="flex justify-between p-4 bg-muted rounded-lg">
          <span className="text-gray-600">Departure</span>
          <span className="font-medium">{formattedDate}</span>
        </div>
        <div className="flex justify-between p-4 bg-muted rounded-lg">
          <span className="text-gray-600">Duration</span>
          <span className="font-medium">{Math.round(flightDetails.duration)} minutes</span>
        </div>
      </div>

      <div className="text-center p-6 bg-gradient-sunset rounded-xl">
        <h3 className="text-xl font-semibold mb-2 text-white">Recommended Seat Side</h3>
        <div className="text-4xl font-bold mb-4 text-white">
          {recommendation.side === 'LEFT' ? '← LEFT' : 'RIGHT →'}
          <span className="ml-2">🌅</span>
        </div>
        <p className="text-white mb-4">{recommendation.reason}</p>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Sun Events</h3>
        {(!recommendation.sunrise && !recommendation.sunset) ? (
          <p className="text-gray-600">
            You won't experience any sunrise or sunset during this flight.
          </p>
        ) : (
          <div className="space-y-4">
            {recommendation.sunrise && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium">Sunrise</h4>
                <p>{recommendation.sunrise.time.toLocaleTimeString()}</p>
                <p className="text-sm text-gray-600">
                  at {recommendation.sunrise.location.lat.toFixed(2)}°N, {recommendation.sunrise.location.lon.toFixed(2)}°E
                </p>
              </div>
            )}
            {recommendation.sunset && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium">Sunset</h4>
                <p>{recommendation.sunset.time.toLocaleTimeString()}</p>
                <p className="text-sm text-gray-600">
                  at {recommendation.sunset.location.lat.toFixed(2)}°N, {recommendation.sunset.location.lon.toFixed(2)}°E
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}