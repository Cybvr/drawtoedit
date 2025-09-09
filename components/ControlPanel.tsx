import React, { useRef } from 'react';
import { ResetIcon, UploadIcon, GenerateIcon } from './Icons';

interface ControlPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  blendStrength: number;
  setBlendStrength: (strength: number) => void;
  onBgChange: (file: File | null) => void;
  onFgChange: (file: File | null) => void;
  onGenerate: () => void;
  onReset: () => void;
  isGenerating: boolean;
}

const FileInput: React.FC<{ label: string; hint: string; onChange: (file: File | null) => void }> = ({ label, hint, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
    setFileName(file?.name || null);
  };
  
  const handleReset = (e: React.MouseEvent) => {
      e.stopPropagation();
      if(inputRef.current) {
          inputRef.current.value = "";
      }
      onChange(null);
      setFileName(null);
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-muted-foreground mb-1">{label} <span className="text-muted-foreground/50 text-xs">{hint}</span></label>
      <div className="relative flex items-center justify-center w-full px-3 py-2 text-sm text-muted-foreground bg-input border-2 border-dashed border-border rounded-md cursor-pointer hover:border-primary/80 hover:text-primary transition-colors">
        <UploadIcon className="w-5 h-5 mr-2" />
        <span>{fileName || 'Click to upload'}</span>
        <input ref={inputRef} type="file" accept="image/png, image/jpeg" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleChange} />
         {fileName && (
            <button onClick={handleReset} className="absolute right-2 text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        )}
      </div>
    </div>
  );
};

export const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const { prompt, setPrompt, blendStrength, setBlendStrength, onBgChange, onFgChange, onGenerate, onReset, isGenerating } = props;
  
  return (
    <div className="p-6 flex flex-col space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Draw-to-Edit</h2>
        <p className="text-sm text-muted-foreground font-mono">Canvas → Edit</p>
      </div>

      <div className="flex flex-col space-y-4 flex-grow">
        <FileInput label="bg (background)" hint="bg = background" onChange={onBgChange} />
        <FileInput label="text (foreground)" hint="text = foreground" onChange={onFgChange} />

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-muted-foreground mb-1">Prompt</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe edits or style"
            className="w-full h-24 p-2 text-sm bg-input border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring transition resize-none"
            disabled={isGenerating}
          />
        </div>

        <div>
          <label htmlFor="blendStrength" className="block text-sm font-medium text-muted-foreground mb-1">Blend Strength</label>
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
        </div>
      </div>


      <div className="flex flex-col space-y-3 pt-4">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full flex items-center justify-center px-4 py-2.5 font-semibold text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed transition-all"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <GenerateIcon className="w-5 h-5 mr-2"/>
              Generate
            </>
          )}
        </button>
        <button
          onClick={onReset}
          disabled={isGenerating}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary rounded-md hover:bg-muted disabled:opacity-50 transition"
        >
          <ResetIcon className="w-5 h-5 mr-2"/>
          Reset
        </button>
      </div>
    </div>
  );
};