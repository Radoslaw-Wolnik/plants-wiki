// src/components/common/Button.tsx

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  className = '', 
  ...props 
}) => {
  const baseStyle = 'font-bold rounded focus:outline-none focus:ring-2 focus:ring-opacity-50';
  const variantStyles = {
    primary: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400',
  };
  const sizeStyles = {
    small: 'py-1 px-2 text-sm',
    medium: 'py-2 px-4',
    large: 'py-3 px-6 text-lg',
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;