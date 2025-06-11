interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

export default function InputField({
  label,
  name,
  type,
  value,
  onChange,
  required,
  error,
  placeholder
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete="off"
        placeholder={placeholder}
        className={`block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:outline-none ${
          error ? 'border-error text-error-foreground' : 'border-muted'
        } bg-muted placeholder:text-gray-500`}
      />
      {error && <p className="text-sm text-error font-medium">{error}</p>}
    </div>
  );
}