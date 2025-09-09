import React from 'react';

interface GeneratedImageDisplayProps {
  isLoading: boolean;
  error: string | null;
  generatedImage: string | null;
  generatedText: string | null;
}

export const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({
  isLoading,
  error,
  generatedImage,
  generatedText,
}) => {
  return (
    <div className="relative w-[512px] h-[512px] bg-background rounded-lg shadow-2xl flex items-center justify-center p-4 border border-border">
      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
          <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h3 className="text-lg font-semibold text-foreground">Generating your vision...</h3>
          <p className="text-sm">The nanobanana is hard at work.</p>
        </div>
      )}
      {error && (
        <div className="text-center text-red-400">
          <h3 className="text-lg font-semibold mb-2">Generation Failed</h3>
          <p className="text-sm bg-red-500/10 p-2 rounded">{error}</p>
        </div>
      )}
      {!isLoading && !error && generatedImage && (
        <>
            <img src={generatedImage} alt="Generated result" className="object-contain w-full h-full rounded-md" />
            {generatedText && <p className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-2 rounded">{generatedText}</p>}
        </>
      )}
      {!isLoading && !error && !generatedImage && (
        <div className="text-center text-muted-foreground">
          <h3 className="text-lg font-semibold text-foreground">Output</h3>
          <p className="text-sm">Your generated image will appear here.</p>
        </div>
      )}
    </div>
  );
};