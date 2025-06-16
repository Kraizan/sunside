"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sun, Plane } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <div className="text-center max-w-lg space-y-6">
        <div className="animate__animated animate__fadeInDown flex justify-center text-[5rem] text-primary">
          <Sun className="animate-spin-slow" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Lost in the skies?
        </h1>
        <p className="text-muted-foreground text-lg">
          We searched the horizon, but couldn&apos;t find that page.
          <br />
          Maybe it took the wrong flight path?
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link href="/">
            <Button className="bg-chart-3 hover:bg-chart-3/80 font-semibold text-primary-foreground shadow-md hover:opacity-90 transition cursor-pointer">
              <Plane className="w-4 h-4 mr-2" />
              Return to Base
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
