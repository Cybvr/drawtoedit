import React, { useState, useRef, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { CanvasComponent, CanvasHandle } from './components/Canvas';
import { Header } from './components/Header';
import { editImage } from './services/geminiService';
import { GeneratedImageDisplay } from './components/GeneratedImageDisplay';
import { Toolbar } from './components/Toolbar';

export type DrawingTool = 'brush' | 'eraser';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [blendStrength, setBlendStrength] = useState(50);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [fgImage, setFgImage] = useState<string | null>(null);

  // Drawing tool state
  const [tool, setTool] = useState<DrawingTool>('brush');
  const [brushColor, setBrushColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(8);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);

  const canvasRef = useRef<CanvasHandle>(null);

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleBgChange = async (file: File | null) => {
    if (file) {
      const url = await fileToDataUrl(file);
      setBgImage(url);
    } else {
      setBgImage(null);
    }
  };

  const handleFgChange = async (file: File | null) => {
    if (file) {
      const url = await fileToDataUrl(file);
      setFgImage(url);
    } else {
      setFgImage(null);
    }
  };

  const getBlendModifier = (strength: number): string => {
    if (strength <= 20) return " (very subtle edit)";
    if (strength <= 40) return " (subtle edit)";
    if (strength >= 80) return " (very strong effect)";
    if (strength >= 61) return " (strong effect)";
    return "";
  };

  const handleGenerate = useCallback(async () => {
    if (!canvasRef.current || (!bgImage && !fgImage)) {
      setError("Please add a background or foreground image to start.");
      return;
    }
    if (!prompt.trim()) {
      setError("Please enter a prompt to describe your edits.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedText(null);

    try {
      const compositeImageBase64 = canvasRef.current.getCombinedCanvasAsBase64();
      if (!compositeImageBase64) {
        throw new Error("Could not get image from canvas.");
      }

      const fullPrompt = prompt + getBlendModifier(blendStrength);
      const result = await editImage(compositeImageBase64, fullPrompt);

      setGeneratedImage(result.image);
      setGeneratedText(result.text);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [prompt, bgImage, fgImage, blendStrength]);

  const handleReset = () => {
    setPrompt('');
    setBlendStrength(50);
    setBgImage(null);
    setFgImage(null);
    setIsLoading(false);
    setError(null);
    setGeneratedImage(null);
    setGeneratedText(null);
    setTool('brush');
    setBrushColor('#FFFFFF');
    setBrushSize(8);
    canvasRef.current?.reset();
  };
  
  const handleUndo = () => canvasRef.current?.undo();
  const handleRedo = () => canvasRef.current?.redo();

  return (
    <div className="flex flex-col h-screen font-sans bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 bg-background flex flex-col border-r border-border overflow-y-auto">
          <Toolbar
            tool={tool}
            setTool={setTool}
            brushColor={brushColor}
            setBrushColor={setBrushColor}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            onUndo={handleUndo}
            onRedo={handleRedo}
            isGenerating={isLoading}
          />
          <ControlPanel
            prompt={prompt}
            setPrompt={setPrompt}
            blendStrength={blendStrength}
            setBlendStrength={setBlendStrength}
            onBgChange={handleBgChange}
            onFgChange={handleFgChange}
            onGenerate={handleGenerate}
            onReset={handleReset}
            isGenerating={isLoading}
          />
        </aside>
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-background/50 overflow-auto">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">Drag & drop images directly onto the canvas.</p>
          </div>
           <div className="w-full flex-1 flex items-center justify-center gap-8">
            <div className="relative w-[512px] h-[512px] bg-[hsl(var(--muted))] rounded-lg shadow-2xl overflow-hidden">
              <CanvasComponent ref={canvasRef} bgImage={bgImage} fgImage={fgImage} tool={tool} brushColor={brushColor} brushSize={brushSize} />
            </div>
            <GeneratedImageDisplay
              isLoading={isLoading}
              error={error}
              generatedImage={generatedImage}
              generatedText={generatedText}
            />
           </div>
        </main>
      </div>
    </div>
  );
};

export default App;