import React from 'react';

interface SliderProps {
  value: number[];
  onValueChange: (values: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  label?: string;
}

const Slider = ({ 
  value, 
  onValueChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  className = "",
  label
}: SliderProps) => {
  const percentage = ((value[0] - min) / (max - min)) * 100;

  return (
    <div className={`${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <span className="text-sm text-gray-500">{value[0]}</span>
        </div>
      )}
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-2 bg-blue-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          step={step}
          onChange={(e) => onValueChange([Number(e.target.value)])}
          className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
        />
        <div
          className="absolute h-4 w-4 bg-white border-2 border-blue-500 rounded-full shadow transform -translate-y-1"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  );
};

export default Slider;