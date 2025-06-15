import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import FlightForm from '@/components/FlightForm';
import HeroGlobe from '@/components/HeroGlobe';

export default function PlanPage() {
  return (
    <main className="bg-muted dark:bg-background overflow-y-hidden h-screen">
      <Navbar />
      <section className="flex items-start justify-center">
        <div className='hidden lg:block'><HeroGlobe /></div>
        <Card className="w-full max-w-xl shadow-xl border border-border my-auto">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-semibold text-foreground">
              📍 Plan Your Flight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FlightForm />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
