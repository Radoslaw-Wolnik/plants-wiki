// src/components/ui/toggle.tsx
import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ checked, onChange, label, disabled, className = '' }, ref) => {
    return (
      <label className={`inline-flex items-center ${className}`}>
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            ref={ref}
          />
          <div
            className={`
              w-10 h-6 rounded-full transition-colors
              ${checked ? 'bg-primary-500' : 'bg-neutral-300'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div
              className={`
                absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full 
                transition-transform transform
                ${checked ? 'translate-x-4' : ''}
              `}
            />
          </div>
        </div>
        {label && (
          <span className={`ml-3 ${disabled ? 'opacity-50' : ''}`}>
            {label}
          </span>
        )}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;