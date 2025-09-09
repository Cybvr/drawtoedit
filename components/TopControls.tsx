import React, { useRef } from 'react';
import { UploadIcon, ResetIcon } from './Icons';

interface TopControlsProps {
  onBgChange: (file: File | null) => void;
  onFgChange: (file: File | null) => void;
  onReset: () => void;
  isGenerating: boolean;
}

const FileUploadButton: React.FC<{ 
  label: string; 
  onChange: (file: File | null) => void;
  disabled?: boolean;
}> = ({ label, onChange, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
    setFileName(file?.name || null);
  };
  
  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange(null);
    setFileName(null);
  };

  return (
    <div className="relative">
      <button
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-secondary hover:bg-muted disabled:opacity-50 rounded-md transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <UploadIcon className="w-4 h-4" />
        {fileName ? fileName.substring(0, 15) + (fileName.length > 15 ? '...' : '') : label}
      </button>
      <input 
        ref={inputRef} 
        type="file" 
        accept="image/png, image/jpeg" 
        className="hidden" 
        onChange={handleChange} 
      />
      {fileName && (
        <button 
          onClick={handleReset} 
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
        >
          ×
        </button>
      )}
    </div>
  );
};

export const TopControls: React.FC<TopControlsProps> = ({
  onBgChange,
  onFgChange,
  onReset,
  isGenerating
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background">
      <div className="flex items-center gap-4">
        <FileUploadButton 
          label="Background" 
          onChange={onBgChange} 
          disabled={isGenerating}
        />
        <FileUploadButton 
          label="Foreground" 
          onChange={onFgChange} 
          disabled={isGenerating}
        />
      </div>
      
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground">Draw-to-Edit Canvas</h2>
        <p className="text-xs text-muted-foreground">Drag & drop images directly onto the canvas</p>
      </div>
      
      <button
        onClick={onReset}
        disabled={isGenerating}
        className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground bg-secondary hover:bg-muted disabled:opacity-50 rounded-md transition-colors"
      >
        <ResetIcon className="w-4 h-4"/>
        Reset All
      </button>
    </div>
  );
};