'use client';

import { useState, useRef, useEffect } from 'react';
import { airports } from '@/data/airports';

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export default function AirportInput({
  label,
  name,
  value,
  onChange,
  error,
  required,
  placeholder
}: Props) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={onChange}
          required={required}
          autoComplete="off"
          placeholder={placeholder}
          className={`block w-full px-4 py-2 border rounded-lg shadow-sm 
            focus:ring-2 focus:ring-primary focus:outline-none 
            transition-colors duration-200 ease-fluid
            ${error 
              ? 'border-error text-error-foreground' 
              : 'border-border bg-card text-foreground'
            } placeholder:text-muted-text`}
        />
      </div>
      {error && <p className="text-sm text-error font-medium">{error}</p>}
    </div>
  );
}
