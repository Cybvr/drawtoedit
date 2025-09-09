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

const colors = ['#FFFFFF', '#000000', '#EF4444', '#22C55E', '#3B82F6', '#EAB308'];

const ToolbarSection: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</h3>
        {children}
    </div>
);


export const Toolbar: React.FC<ToolbarProps> = ({
  tool, setTool, brushColor, setBrushColor, brushSize, setBrushSize, onUndo, onRedo, isGenerating
}) => {
  return (
    <div className="w-full p-6 border-b border-border flex flex-col gap-6">
      <ToolbarSection title="Tools">
        <div className="flex items-center gap-1 p-1 bg-secondary rounded-md w-full">
          <button 
            onClick={() => setTool('brush')}
            disabled={isGenerating}
            aria-label="Select Brush Tool"
            title="Brush"
            className={`flex-1 justify-center p-2 rounded transition-colors disabled:opacity-50 flex items-center gap-2 text-sm ${tool === 'brush' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            <BrushIcon className="w-5 h-5"/>
            Brush
          </button>
          <button 
            onClick={() => setTool('eraser')}
            disabled={isGenerating}
            aria-label="Select Eraser Tool"
            title="Eraser"
            className={`flex-1 justify-center p-2 rounded transition-colors disabled:opacity-50 flex items-center gap-2 text-sm ${tool === 'eraser' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            <EraserIcon className="w-5 h-5"/>
            Eraser
          </button>
        </div>
      </ToolbarSection>

      <ToolbarSection title="Color">
        <div className="flex items-center gap-3 flex-wrap">
          {colors.map(c => (
            <button 
              key={c} 
              onClick={() => setBrushColor(c)} 
              disabled={isGenerating}
              aria-label={`Select color ${c}`}
              title={c}
              className={`w-7 h-7 rounded-full border-2 transition-transform transform hover:scale-110 ${brushColor === c ? 'border-primary scale-110' : 'border-border'}`}
              style={{backgroundColor: c}}
            />
          ))}
        </div>
      </ToolbarSection>

      <ToolbarSection title="Brush Size">
        <div className="flex items-center gap-2">
          <BrushIcon className="w-4 h-4 text-muted-foreground" />
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            disabled={isGenerating}
            aria-label="Adjust Brush Size"
            title={`Brush size: ${brushSize}`}
          />
        </div>
      </ToolbarSection>
      
      <ToolbarSection title="History">
        <div className="flex items-center gap-2">
          <button onClick={onUndo} disabled={isGenerating} aria-label="Undo" title="Undo" className="flex-1 flex items-center justify-center gap-2 p-2 rounded-md bg-secondary hover:bg-muted disabled:opacity-50 transition text-sm"><UndoIcon className="w-5 h-5" /> Undo</button>
          <button onClick={onRedo} disabled={isGenerating} aria-label="Redo" title="Redo" className="flex-1 flex items-center justify-center gap-2 p-2 rounded-md bg-secondary hover:bg-muted disabled:opacity-50 transition text-sm"><RedoIcon className="w-5 h-5" /> Redo</button>
        </div>
      </ToolbarSection>
    </div>
  );
};