import Navbar from '@/components/Navbar';
import FlightForm from '@/components/FlightForm';

export default function PlanPage() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen pt-24 px-4 bg-muted">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gradient-sunrise">
            📍 Plan Your Flight
          </h1>
          <FlightForm />
        </div>
      </div>
    </main>
  );
}