'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import type { FlightDetails, FormErrors, SunPreference } from '@/types/flight';

export default function FlightForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FlightDetails>({
    source: '',
    destination: '',
    departureTime: '',
    duration: 0
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [sunPreference, setSunPreference] = useState<SunPreference>({
    wantsSunrise: false,
    wantsSunset: false,
    priority: null
  });

  useEffect(() => {
    const saved = localStorage.getItem('flightFormData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
      } catch (err) {
        console.error('Invalid localStorage data:', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flightFormData', JSON.stringify(formData));
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    if (!formData.source) newErrors.source = 'Source required';
    if (!formData.destination) newErrors.destination = 'Destination required';
    if (!formData.departureTime) newErrors.departureTime = 'Departure time required';
    if (!formData.duration) newErrors.duration = 'Duration required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    localStorage.removeItem('flightFormData');

    const queryParams = new URLSearchParams({
      ...formData as any,
      wantsSunrise: sunPreference.wantsSunrise.toString(),
      wantsSunset: sunPreference.wantsSunset.toString(),
      priority: sunPreference.priority || ''
    });

    router.push(`/result?${queryParams}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSunPreference(prev => ({
      ...prev,
      [name]: checked,
      priority:
        name === 'wantsSunrise' && checked ? 'SUNRISE' :
        name === 'wantsSunset' && checked ? 'SUNSET' :
        prev.priority
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Source */}
      <div className="space-y-1">
        <Label htmlFor="source">From (Airport Code)</Label>
        <Input
          id="source"
          name="source"
          placeholder="e.g. BOS"
          value={formData.source}
          onChange={handleChange}
          required
        />
        {errors.source && <p className="text-sm text-red-500">{errors.source}</p>}
      </div>

      {/* Destination */}
      <div className="space-y-1">
        <Label htmlFor="destination">To (Airport Code)</Label>
        <Input
          id="destination"
          name="destination"
          placeholder="e.g. JFK"
          value={formData.destination}
          onChange={handleChange}
          required
        />
        {errors.destination && <p className="text-sm text-red-500">{errors.destination}</p>}
      </div>

      {/* Departure Time */}
      <div className="space-y-1">
        <Label htmlFor="departureTime">Departure Time</Label>
        <Input
          id="departureTime"
          type="datetime-local"
          name="departureTime"
          value={formData.departureTime}
          onChange={handleChange}
          required
        />
        {errors.departureTime && <p className="text-sm text-red-500">{errors.departureTime}</p>}
      </div>

      {/* Duration */}
      <div className="space-y-1">
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
        {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
      </div>

      <Separator />

      {/* Sun Preferences */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Sun Preferences</p>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="wantsSunrise"
            name="wantsSunrise"
            checked={sunPreference.wantsSunrise}
            onCheckedChange={(checked: any) => {
              handleCheckbox({ target: { name: 'wantsSunrise', checked } } as any);
            }}
          />
          <Label htmlFor="wantsSunrise">I want to see the sunrise</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="wantsSunset"
            name="wantsSunset"
            checked={sunPreference.wantsSunset}
            onCheckedChange={(checked: any) => {
              handleCheckbox({ target: { name: 'wantsSunset', checked } } as any);
            }}
          />
          <Label htmlFor="wantsSunset">I want to see the sunset</Label>
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full mt-4">
        Get Seat Recommendation
      </Button>
    </form>
  );
}
