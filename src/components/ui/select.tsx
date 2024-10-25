// src/components/ui/select.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  label?: string;
  error?: string;
  hint?: string;
  onChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, error, hint, options, onChange, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={`
              flex h-10 w-full appearance-none rounded-md border 
              border-neutral-300 bg-white px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-primary-500 
              focus:border-transparent disabled:cursor-not-allowed 
              disabled:opacity-50
              ${error ? "border-danger-500 focus:ring-danger-500" : ""}
              ${className}
            `}
            onChange={e => onChange?.(e.target.value)}
            ref={ref}
            {...props}
          >
            {options.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-neutral-500" />
        </div>
        {error && (
          <p className="text-sm text-danger-500">{error}</p>
        )}
        {hint && !error && (
          <p className="text-sm text-neutral-500">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;