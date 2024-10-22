// ColorChooser.tsx
import React from 'react';
import { ChromePicker } from 'react-color';
import { Slider } from '@/components/ui/slider';

interface ColorChooserProps {
  color: string;
  setColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
}

export const ColorChooser: React.FC<ColorChooserProps> = ({ color, setColor, brushSize, setBrushSize }) => (
  <div className="flex space-x-4 mb-4">
    <ChromePicker color={color} onChange={(c) => setColor(c.hex)} disableAlpha={true} />
    <div className="flex flex-col">
      <span className="mb-2">Brush Size: {brushSize}</span>
      <Slider
        value={[brushSize]}
        onValueChange={(values: number[]) => setBrushSize(values[0])}
        max={5}
        step={1}
        className="w-32"
      />
    </div>
  </div>
);
