'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InputField from './InputField';
import AirportInput from './AirportInput';
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

  // Restore form state from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('flightFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (
          parsedData.source &&
          parsedData.destination &&
          parsedData.departureTime &&
          parsedData.duration
        ) {
          setFormData(parsedData);
        }
      } catch (error) {
        console.error('Failed to parse flightFormData from localStorage:', error);
      }
    }
  }, []);

  // Save form state to localStorage
  useEffect(() => {
    localStorage.setItem('flightFormData', JSON.stringify(formData));
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('flightFormData', JSON.stringify(
      {
        source: '',
        destination: '',
        departureTime: '',
        duration: 0
      }
    ));
    
    // Basic validation
    const newErrors: FormErrors = {};
    if (!formData.source) newErrors.source = 'Source is required';
    if (!formData.destination) newErrors.destination = 'Destination is required';
    if (!formData.departureTime) newErrors.departureTime = 'Departure time is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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

  const handleSunPreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSunPreference(prev => ({
      ...prev,
      [name]: checked,
      priority: name === 'wantsSunrise' && checked ? 'SUNRISE' : 
               name === 'wantsSunset' && checked ? 'SUNSET' : 
               prev.priority
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto space-y-6">
      <AirportInput
        label="From (City or Airport)"
        name="source"
        value={formData.source}
        onChange={handleChange}
        error={errors.source}
        required
        placeholder="e.g. BOS"
      />
      <AirportInput
        label="To (City or Airport)"
        name="destination"
        value={formData.destination}
        onChange={handleChange}
        error={errors.destination}
        required
        placeholder="e.g. JFK"
      />
      <InputField
        label="Departure Time"
        type="datetime-local"
        name="departureTime"
        value={formData.departureTime}
        onChange={handleChange}
        error={errors.departureTime}
        required
        placeholder="Select departure time"
      />
      <InputField
        label="Flight Duration (minutes)"
        type="number"
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        error={errors.duration}
        required
        placeholder="e.g. 120"
      />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sun Preferences</h3>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="wantsSunrise"
            name="wantsSunrise"
            checked={sunPreference.wantsSunrise}
            onChange={handleSunPreferenceChange}
            className="checkbox"
          />
          <label htmlFor="wantsSunrise">I want to see the sunrise</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="wantsSunset"
            name="wantsSunset"
            checked={sunPreference.wantsSunset}
            onChange={handleSunPreferenceChange}
            className="checkbox"
          />
          <label htmlFor="wantsSunset">I want to see the sunset</label>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
      >
        Get Seat Recommendation
      </button>
    </form>
  );
}