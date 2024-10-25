import React, { useState, useEffect } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { Button } from '@/components/ui/button';


interface AdvancedColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const AdvancedColorPicker: React.FC<AdvancedColorPickerProps> = ({ color, onChange }) => {
  const [recentColors, setRecentColors] = useState<string[]>([]);

  useEffect(() => {
    const storedColors = localStorage.getItem('recentColors');
    if (storedColors) {
      setRecentColors(JSON.parse(storedColors));
    }
  }, []);

  const handleColorChange = (newColor: string) => {
    onChange(newColor);
    updateRecentColors(newColor);
  };

  const updateRecentColors = (newColor: string) => {
    const updatedColors = [newColor, ...recentColors.filter(c => c !== newColor)].slice(0, 10);
    setRecentColors(updatedColors);
    localStorage.setItem('recentColors', JSON.stringify(updatedColors));
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
      <ChromePicker 
        color={color} 
        onChange={(colorResult: ColorResult) => handleColorChange(colorResult.hex)} 
        disableAlpha={true} 
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Recent Colors</h3>
        <div className="flex flex-wrap gap-2">
          {recentColors.map((recentColor, index) => (
            <Button
              key={index}
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: recentColor }}
              onClick={() => handleColorChange(recentColor)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedColorPicker;