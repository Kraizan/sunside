"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sunrise, Sunset } from "lucide-react";
import type { FlightDetails, FormErrors, SunPreference } from "@/types/flight";

export function FlightForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FlightDetails>({
    source: "",
    destination: "",
    departureTime: "",
    duration: 0,
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

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSunPreference((prev) => ({
      ...prev,
      [name]: checked,
      priority:
        name === "wantsSunrise" && checked
          ? "SUNRISE"
          : name === "wantsSunset" && checked
          ? "SUNSET"
          : prev.priority,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Source */}
      <div className="space-y-1 flex flex-col gap-y-1.5">
        <Label htmlFor="source">From (Airport Code)</Label>
        <Input
          id="source"
          name="source"
          placeholder="e.g. BOS"
          value={formData.source}
          onChange={handleChange}
          required
        />
        {errors.source && (
          <p className="text-sm text-red-500">{errors.source}</p>
        )}
      </div>

      {/* Destination */}
      <div className="space-y-1 flex flex-col gap-y-1.5">
        <Label htmlFor="destination">To (Airport Code)</Label>
        <Input
          id="destination"
          name="destination"
          placeholder="e.g. JFK"
          value={formData.destination}
          onChange={handleChange}
          required
        />
        {errors.destination && (
          <p className="text-sm text-red-500">{errors.destination}</p>
        )}
      </div>

      {/* Departure Time */}
      <div className="space-y-1 flex flex-col gap-y-1.5">
        <Label htmlFor="departureTime">Departure Time</Label>
        <Input
          id="departureTime"
          type="datetime-local"
          name="departureTime"
          value={formData.departureTime}
          onChange={handleChange}
          required
        />
        {errors.departureTime && (
          <p className="text-sm text-red-500">{errors.departureTime}</p>
        )}
      </div>

      {/* Duration */}
      <div className="space-y-1 flex flex-col gap-y-1.5">
        <Label htmlFor="duration">Flight Duration (minutes)</Label>
        <Input
          id="duration"
          type="number"
          name="duration"
          placeholder="e.g. 120"
          value={formData.duration}
          onChange={handleChange}
          required
        />
        {errors.duration && (
          <p className="text-sm text-red-500">{errors.duration}</p>
        )}
      </div>

      <Separator />

      {/* Sun Preferences */}
      <div className="space-y-4 p-4 border rounded-lg bg-card">
        <p className="text-lg font-semibold text-foreground">Sun Preferences</p>
        <div className="grid gap-1.5">
          <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-accent transition-colors">
            <Checkbox
              id="wantsSunrise"
              name="wantsSunrise"
              checked={sunPreference.wantsSunrise}
              onCheckedChange={(checked: any) => {
                handleCheckbox({
                  target: { name: "wantsSunrise", checked },
                } as any);
              }}
              className="data-[state=checked]:bg-chart-3 data-[state=checked]:text-white dark:data-[state=checked]:border-chart-3 dark:data-[state=checked]:bg-chart-3"
            />
            <Label
              htmlFor="wantsSunrise"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Sunrise className="h-5 w-5 text-amber-500" />
              <span>I want to see the sunrise</span>
            </Label>
          </div>

          <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-accent transition-colors">
            <Checkbox
              id="wantsSunset"
              name="wantsSunset"
              checked={sunPreference.wantsSunset}
              onCheckedChange={(checked: any) => {
                handleCheckbox({
                  target: { name: "wantsSunset", checked },
                } as any);
              }}
              className="data-[state=checked]:bg-chart-3 data-[state=checked]:text-white dark:data-[state=checked]:border-chart-3 dark:data-[state=checked]:bg-chart-3"
            />
            <Label
              htmlFor="wantsSunset"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Sunset className="h-5 w-5 text-orange-500" />
              <span>I want to see the sunset</span>
            </Label>
          </div>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full mt-4 cursor-pointer bg-chart-3 font-bold py-4 hover:bg-chart-3/80"
      >
        Get Seat Recommendation
      </Button>
    </form>
  );
}
