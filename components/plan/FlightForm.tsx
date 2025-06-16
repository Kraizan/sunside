"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormField } from "./FormField";
import { SunPreferences } from "./SunPreferences";
import type { FlightDetails, FormErrors, SunPreference } from "@/types/flight";

export function FlightForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FlightDetails>({
    source: "",
    destination: "",
    departureTime: "",
    duration: 0,
    sunPreference: {
      wantsSunrise: false,
      wantsSunset: false,
      priority: null,
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [sunPreference, setSunPreference] = useState<SunPreference>({
    wantsSunrise: false,
    wantsSunset: false,
    priority: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem("flightFormData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
      } catch (err) {
        console.error("Invalid localStorage data:", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("flightFormData", JSON.stringify(formData));
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    if (!formData.source) newErrors.source = "Source required";
    if (!formData.destination) newErrors.destination = "Destination required";
    if (!formData.departureTime)
      newErrors.departureTime = "Departure time required";
    if (!formData.duration) newErrors.duration = "Duration required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    localStorage.removeItem("flightFormData");

    const queryParams = new URLSearchParams({
      ...(formData as any),
      wantsSunrise: sunPreference.wantsSunrise.toString(),
      wantsSunset: sunPreference.wantsSunset.toString(),
      priority: sunPreference.priority || "",
    });

    router.push(`/result?${queryParams}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="From (Airport Code)"
        name="source"
        value={formData.source}
        onChange={handleChange}
        placeholder="e.g. BOS"
        error={errors.source}
        required
      />

      <FormField
        label="To (Airport Code)"
        name="destination"
        value={formData.destination}
        onChange={handleChange}
        placeholder="e.g. JFK"
        error={errors.destination}
        required
      />

      <FormField
        label="Departure Time"
        name="departureTime"
        type="datetime-local"
        value={formData.departureTime}
        onChange={handleChange}
        error={errors.departureTime}
        required
      />

      <FormField
        label="Flight Duration (minutes)"
        name="duration"
        type="number"
        value={formData.duration}
        onChange={handleChange}
        placeholder="e.g. 120"
        error={errors.duration}
        required
      />

      <Separator />

      <SunPreferences
        sunPreference={sunPreference}
        onPreferenceChange={setSunPreference}
      />

      <Button
        type="submit"
        className="w-full mt-4 cursor-pointer bg-chart-3 font-bold py-4 hover:bg-chart-3/80"
      >
        Get Seat Recommendation
      </Button>
    </form>
  );
}
