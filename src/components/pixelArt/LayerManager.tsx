// LayerManager.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface Layer {
  id: number;
  visible: boolean;
}

interface LayerManagerProps {
  layers: Layer[];
  currentLayer: number;
  setCurrentLayer: (layerId: number) => void;
  toggleLayerVisibility: (layerId: number) => void;
  addLayer: () => void;
  maxLayers: number;
}

export const LayerManager: React.FC<LayerManagerProps> = ({
  layers, currentLayer, setCurrentLayer, toggleLayerVisibility, addLayer, maxLayers
}) => (
  <div className="mt-4 w-full max-w-md">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-semibold">Layers</h3>
      <Button onClick={addLayer} disabled={layers.length >= maxLayers}>Add Layer</Button>
    </div>
    {layers.map((layer, index) => (
      <div key={layer.id} className={`flex items-center justify-between bg-white p-2 rounded mb-2 ${currentLayer === index ? 'border-2 border-blue-500' : ''}`}>
        <Button
          onClick={() => setCurrentLayer(index)}
          variant={currentLayer === index ? 'default' : 'outline'}
        >
          Layer {layer.id + 1}
        </Button>
        <Button onClick={() => toggleLayerVisibility(layer.id)}>
          {layer.visible ? <Eye size={20} /> : <EyeOff size={20} />}
        </Button>
      </div>
    ))}
  </div>
);