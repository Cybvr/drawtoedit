import React from 'react';
import { BrushIcon, EraserIcon, UndoIcon, RedoIcon } from './Icons';
import { DrawingTool } from '../App';

interface ToolbarProps {
  tool: DrawingTool;
  setTool: (tool: DrawingTool) => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  isGenerating: boolean;
}

const colors = ['#FFFFFF', '#000000', '#EF4444', '#22C55E', '#3B82F6', '#EAB308', '#8B5CF6', '#F59E0B'];

const SelectIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
  </svg>
);

export const Toolbar: React.FC<ToolbarProps> = ({
  tool, setTool, brushColor, setBrushColor, brushSize, setBrushSize, onUndo, onRedo, isGenerating
}) => {
  return (
    <div className="w-full p-3 flex flex-col gap-4 h-full">
      {/* Tools */}
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => setTool('select')}
          disabled={isGenerating}
          aria-label="Select Tool"
          title="Select"
          className={`p-3 rounded-md transition-colors disabled:opacity-50 ${tool === 'select' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        >
          <SelectIcon className="w-5 h-5"/>
        </button>
        <button 
          onClick={() => setTool('brush')}
          disabled={isGenerating}
          aria-label="Brush Tool"
          title="Brush"
          className={`p-3 rounded-md transition-colors disabled:opacity-50 ${tool === 'brush' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        >
          <BrushIcon className="w-5 h-5"/>
        </button>
        <button 
          onClick={() => setTool('eraser')}
          disabled={isGenerating}
          aria-label="Eraser Tool"
          title="Eraser"
          className={`p-3 rounded-md transition-colors disabled:opacity-50 ${tool === 'eraser' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        >
          <EraserIcon className="w-5 h-5"/>
        </button>
      </div>

      {/* Color Palette */}
      <div className="flex flex-col gap-2">
        {colors.map(c => (
          <button 
            key={c} 
            onClick={() => setBrushColor(c)} 
            disabled={isGenerating}
            aria-label={`Select color ${c}`}
            title={c}
            className={`w-8 h-8 rounded-md border-2 transition-transform transform hover:scale-110 ${brushColor === c ? 'border-primary scale-110' : 'border-border'}`}
            style={{backgroundColor: c}}
          />
        ))}
      </div>

      {/* Brush Size */}
      <div className="flex flex-col gap-2 mt-auto">
        <div className="writing-mode-vertical-rl text-orientation-mixed">
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-20 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary transform rotate-90"
            disabled={isGenerating}
            aria-label="Brush Size"
            title={`Brush size: ${brushSize}`}
          />
        </div>
        
        {/* History Controls */}
        <div className="flex flex-col gap-1">
          <button 
            onClick={onUndo} 
            disabled={isGenerating} 
            aria-label="Undo" 
            title="Undo" 
            className="p-2 rounded-md bg-secondary hover:bg-muted disabled:opacity-50 transition"
          >
            <UndoIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={onRedo} 
            disabled={isGenerating} 
            aria-label="Redo" 
            title="Redo" 
            className="p-2 rounded-md bg-secondary hover:bg-muted disabled:opacity-50 transition"
          >
            <RedoIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};