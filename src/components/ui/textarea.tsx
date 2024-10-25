// src/components/ui/textarea.tsx
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, hint, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <textarea
          className={`
            flex w-full rounded-md border border-neutral-300 
            bg-white px-3 py-2 text-sm placeholder:text-neutral-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 
            focus:border-transparent min-h-[80px]
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? "border-danger-500 focus:ring-danger-500" : ""}
            ${className}
          `}
          ref={ref}
          {...props}
        />
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

Textarea.displayName = "Textarea";

export default Textarea;