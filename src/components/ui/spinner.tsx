// src/components/ui/spinner.tsx
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
};

const Spinner = ({ size = "md", className = "" }: SpinnerProps) => {
  return (
    <div
      className={`
        inline-block animate-spin rounded-full 
        border-primary-500 border-t-transparent
        ${sizeMap[size]} ${className}
      `}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;