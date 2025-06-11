import Navbar from '@/components/Navbar';
import FlightForm from '@/components/FlightForm';

export default function PlanPage() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen pt-24 px-4 bg-muted">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gradient-sunrise">
            Enter Your Flight Details
          </h1>
          <FlightForm />
        </div>
      </div>
    </main>
  );
}