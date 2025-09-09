import React from 'react';
import { GenerateIcon } from './Icons';

interface ControlPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  blendStrength: number;
  setBlendStrength: (strength: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  prompt, 
  setPrompt, 
  blendStrength, 
  setBlendStrength, 
  onGenerate, 
  isGenerating
}) => {
  return (
    <div className="p-6 flex items-center gap-6">
      <div className="flex-1">
        <label htmlFor="prompt" className="block text-sm font-medium text-muted-foreground mb-2">
          Describe your edits
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Add a sunset background, change the color to blue, make it more artistic..."
          className="w-full h-20 p-3 text-sm bg-input border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring transition resize-none"
          disabled={isGenerating}
        />
      </div>

      <div className="w-48">
        <label htmlFor="blendStrength" className="block text-sm font-medium text-muted-foreground mb-2">
          Blend Strength: {blendStrength}%
        </label>
        <input
          id="blendStrength"
          type="range"
          min="0"
          max="100"
          value={blendStrength}
          onChange={(e) => setBlendStrength(Number(e.target.value))}
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          disabled={isGenerating}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Subtle</span>
          <span>Strong</span>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="px-8 py-3 font-semibold text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <GenerateIcon className="w-5 h-5"/>
            Generate
          </>
        )}
      </button>
    </div>
  );
};