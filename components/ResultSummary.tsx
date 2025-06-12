import { FlightDetails } from '@/lib/types';

interface ResultSummaryProps {
  flightDetails: FlightDetails;
  recommendedSide: 'LEFT' | 'RIGHT';
}

export default function ResultSummary({ flightDetails, recommendedSide }: ResultSummaryProps) {
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
          {recommendedSide === 'LEFT' ? '← LEFT' : 'RIGHT →'}
          <span className="ml-2">🌅</span>
        </div>
        <p className="text-white">
          For the best sunrise/sunset views during your flight
        </p>
      </div>
    </div>
  );
}