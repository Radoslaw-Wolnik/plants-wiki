// components/Toolbar.tsx
import React from 'react';
import { 
  Pencil, Eraser, Pipette, Grid, Save, Upload, 
  Undo, Redo, Download, FolderOpen, FileUp 
} from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';

interface ToolbarProps {
    tool: string;
    setTool: (tool: "pen" | "eraser" | "eyedropper") => void;
    showGrid: boolean;
    setShowGrid: (show: boolean) => void;
    onSave: () => Promise<void>;
    onLoad: (version: string) => Promise<void>;
    onDownload: () => Promise<void>;
    onLoadProjectFromLocal: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    onupload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
  }

export const Toolbar: React.FC<ToolbarProps> = ({
  tool, setTool, showGrid, setShowGrid,
  onSave, onLoad, onDownload, onLoadProjectFromLocal, onupload,
  canUndo, canRedo, onUndo, onRedo
}) => (
  <div className="flex space-x-2 mb-4">
    <div className="flex space-x-2 border-r pr-2">
      <ToolbarButton 
        tooltip="Pen" 
        onClick={() => setTool('pen')} 
        icon={<Pencil size={20} />} 
        active={tool === 'pen'} 
      />
      <ToolbarButton 
        tooltip="Eraser" 
        onClick={() => setTool('eraser')} 
        icon={<Eraser size={20} />} 
        active={tool === 'eraser'} 
      />
      <ToolbarButton 
        tooltip="Color Picker" 
        onClick={() => setTool('eyedropper')} 
        icon={<Pipette size={20} />} 
        active={tool === 'eyedropper'} 
      />
      <ToolbarButton 
        tooltip="Toggle Grid" 
        onClick={() => setShowGrid(!showGrid)} 
        icon={<Grid size={20} />} 
        active={showGrid} 
      />
    </div>

    <div className="flex space-x-2 border-r pr-2">
      <ToolbarButton 
        tooltip="Save to Server" 
        onClick={onSave} 
        icon={<Save size={20} />} 
      />
      <ToolbarButton 
        tooltip="Load from Server" 
        onClick={() => document.getElementById('uploadInput')?.click()} 
        icon={<Upload size={20} />} 
      />
      <input 
        id="uploadInput" 
        type="file" 
        className="hidden" 
        onChange={onupload} 
        accept="image/*" 
      />
    </div>

    <div className="flex space-x-2 border-r pr-2">
      <ToolbarButton 
        tooltip="Download Project" 
        onClick={onDownload} 
        icon={<Download size={20} />} 
      />
      <ToolbarButton 
        tooltip="Load Project" 
        onClick={() => document.getElementById('loadProjectInput')?.click()} 
        icon={<FolderOpen size={20} />} 
      />
      <input 
        id="loadProjectInput" 
        type="file" 
        className="hidden" 
        onChange={onLoadProjectFromLocal} 
        accept=".json" 
      />
    </div>

    <div className="flex space-x-2">
      <ToolbarButton 
        tooltip="Undo" 
        onClick={onUndo} 
        icon={<Undo size={20} />} 
        disabled={!canUndo} 
      />
      <ToolbarButton 
        tooltip="Redo" 
        onClick={onRedo} 
        icon={<Redo size={20} />} 
        disabled={!canRedo} 
      />
    </div>
  </div>
);