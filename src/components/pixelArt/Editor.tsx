// PixelArtEditor.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Toolbar } from './Toolbar';
import { LayerManager } from './LayerManager';
import AdvancedColorPicker from './AdvancedColorPicker';
import type { Layer, ProjectData } from '../../types/image-editor';
import { Slider } from '@/components/ui/slider';
import {saveToLocal, saveToServer, loadFromLocal, loadFromServer } from '../../utils/image-editor.util'
// npm install react-color lucide-react @radix-ui/react-tooltip @radix-ui/react-slider

const CANVAS_SIZE = process.env.NEXT_PUBLIC_CANVAS_SIZE ? parseInt(process.env.NEXT_PUBLIC_CANVAS_SIZE) : 32;
const MAX_LAYERS = 5;
const MAX_UNDO_STEPS = 5;
const DEFAULT_LAYER: Layer = {
    id: 0,
    data: new ImageData(CANVAS_SIZE, CANVAS_SIZE),
    visible: true,
    name: 'Background'
  };


interface PixelArtEditorProps {
  onSave: (imageData: string, layers: Layer[]) => void;
  onLoad: (projectData: { layers: Layer[] }) => void;
  libraryImages: string[];
}

const PixelArtEditor: React.FC<PixelArtEditorProps> = ({ onSave, onLoad, libraryImages }) => {
  const [layers, setLayers] = useState<Layer[]>([DEFAULT_LAYER]);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [color, setColor] = useState('#000000');
  const [showGrid, setShowGrid] = useState(true);
  const [brushSize, setBrushSize] = useState(1);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'eyedropper'>('pen');
  const [undoStack, setUndoStack] = useState<Layer[][]>([]);
  const [redoStack, setRedoStack] = useState<Layer[][]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawCanvas();
  }, [layers, showGrid]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    layers.forEach((layer) => {
      if (layer.visible) {
        ctx.putImageData(layer.data, 0, 0);
      }
    });

    if (showGrid) {
      drawGrid(ctx);
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 0.5;

    for (let i = 0; i <= CANVAS_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (rect.width / CANVAS_SIZE));
    const y = Math.floor((e.clientY - rect.top) / (rect.height / CANVAS_SIZE));

    if (tool === 'eyedropper') {
      pickColor(x, y);
    } else {
      drawPixel(x, y);
    }
  };

  const pickColor = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const pickedColor = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;
    setColor(pickedColor);
    setTool('pen');
  };

  const drawPixel = (x: number, y: number) => {
    const newLayers = [...layers];
    const layerData = newLayers[currentLayer].data;
    const color32 = hexToRgba(color);

    for (let i = 0; i < brushSize; i++) {
      for (let j = 0; j < brushSize; j++) {
        const px = x + i;
        const py = y + j;
        if (px < CANVAS_SIZE && py < CANVAS_SIZE) {
          const index = (py * CANVAS_SIZE + px) * 4;
          layerData.data[index] = color32[0];
          layerData.data[index + 1] = color32[1];
          layerData.data[index + 2] = color32[2];
          layerData.data[index + 3] = tool === 'eraser' ? 0 : color32[3];
        }
      }
    }

    setUndoStack([...undoStack, layers]);
    setRedoStack([]);
    setLayers(newLayers);
  };

  const hexToRgba = (hex: string): number[] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 255];
  };

  const addLayer = () => {
    if (layers.length < MAX_LAYERS) {
      const newLayer: Layer = {
        id: layers.length,
        data: new ImageData(CANVAS_SIZE, CANVAS_SIZE),
        visible: true,
        name: `Layer ${layers.length + 1}`
      };
      setLayers([...layers, newLayer]);
      setCurrentLayer(layers.length);
    }
  };

  const toggleLayerVisibility = (layerId: number) => {
    setLayers(layers.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  

  const undo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack([...redoStack, layers]);
      setLayers(previousState);
      setUndoStack(undoStack.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack([...undoStack, layers]);
      setLayers(nextState);
      setRedoStack(redoStack.slice(0, -1));
    }
  };

  const handleuploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
  
        ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
        const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        if (layers.length < MAX_LAYERS) {
          setLayers([...layers, { 
            id: layers.length, 
            data: imageData, 
            visible: true,
            name: `Layer ${layers.length + 1}`
          }]);
          setCurrentLayer(layers.length);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveLocal = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    layers.forEach(layer => {
      if (layer.visible) {
        ctx.putImageData(layer.data, 0, 0);
      }
    });
  
    const projectData: ProjectData = {
      layers,
      imageData: canvas.toDataURL('image/png'),
      version: 1
    };
  
    try {
      await saveToLocal(projectData);
    } catch (error) {
      console.error('Error saving locally:', error);
      // Add user feedback here
    }
  };
  
  const handleLoadLocal = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      const projectData = await loadFromLocal(file);
      setLayers(projectData.layers);
      setCurrentLayer(0);
    } catch (error) {
      console.error('Error loading locally:', error);
      // Add user feedback here
    }
  };
  
  const handleSaveServer = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    layers.forEach(layer => {
      if (layer.visible) {
        ctx.putImageData(layer.data, 0, 0);
      }
    });
  
    const imageData = canvas.toDataURL('image/png');
    
    try {
      await saveToServer(imageData, layers);
    } catch (error) {
      console.error('Error saving to server:', error);
      // Add user feedback here
    }
  };
  
  const handleLoadServer = async (version: string) => {
    try {
      const projectData = await loadFromServer(version);
      setLayers(projectData.layers);
      setCurrentLayer(0);
    } catch (error) {
      console.error('Error loading from server:', error);
      // Add user feedback here
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md">
      <Toolbar
        tool={tool}
        setTool={setTool}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        onSave={handleSaveServer}
        onLoad={handleLoadServer}
        onDownload={handleSaveLocal}
        onLoadProjectFromLocal={handleLoadLocal}
        onupload={handleuploadImage}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={undo}
        onRedo={redo}
      />
      <div className="flex space-x-4 mb-4">
        <AdvancedColorPicker color={color} onChange={setColor} />
        <div className="flex flex-col justify-center">
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
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="border border-gray-300 cursor-crosshair"
        style={{ width: '512px', height: '512px', imageRendering: 'pixelated' }}
        onClick={handleCanvasClick}
      />
      <LayerManager
        layers={layers}
        currentLayer={currentLayer}
        setCurrentLayer={setCurrentLayer}
        toggleLayerVisibility={toggleLayerVisibility}
        addLayer={addLayer}
        maxLayers={MAX_LAYERS}
      />
    </div>
  );
};

export default PixelArtEditor;