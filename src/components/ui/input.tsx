// src/components/ui/input.tsx
import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, hint, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {leftIcon}
            </div>
          )}
          <input
            className={`
              flex h-10 w-full rounded-md border border-neutral-300 
              bg-white px-3 py-2 text-sm 
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              placeholder:text-neutral-400
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? "border-danger-500 focus:ring-danger-500" : ""}
              ${className}
            `}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {rightIcon}
            </div>
          )}
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

Input.displayName = "Input";

export default Input;