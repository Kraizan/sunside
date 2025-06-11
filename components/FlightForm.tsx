'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputField from './InputField';
import type { FlightDetails, FormErrors } from '../lib/types';

export default function FlightForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FlightDetails>({
    source: '',
    destination: '',
    departureTime: '',
    duration: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto space-y-6">
      <InputField
        label="From (City or Airport)"
        type="text"
        name="source"
        value={formData.source}
        onChange={handleChange}
        error={errors.source}
        placeholder="e.g., London"
      />
      <InputField
        label="To (City or Airport)"
        type="text"
        name="destination"
        value={formData.destination}
        onChange={handleChange}
        error={errors.destination}
        placeholder="e.g., New York"
      />
      <InputField
        label="Departure Time"
        type="datetime-local"
        name="departureTime"
        value={formData.departureTime}
        onChange={handleChange}
        error={errors.departureTime}
      />
      <InputField
        label="Flight Duration (minutes)"
        type="number"
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        error={errors.duration}
        placeholder="e.g., 120"
      />
      <button
        type="submit"
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Get Seat Recommendation
      </button>
    </form>
  );
}