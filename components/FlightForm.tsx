'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InputField from './InputField';
import AirportInput from './AirportInput';
import type { FlightDetails, FormErrors } from '@/lib/types';

export default function FlightForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FlightDetails>({
    source: '',
    destination: '',
    departureTime: '',
    duration: 0
  });
  const [errors, setErrors] = useState<FormErrors>({});

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

    // Create query string
    const queryString = new URLSearchParams(formData as any).toString();
    router.push(`/result?${queryString}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
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
      <button
        type="submit"
        className="btn btn-primary w-full"
      >
        Get Seat Recommendation
      </button>
    </form>
  );
}