import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { useCanvasHistory } from '../hooks/useCanvasHistory';
import { DrawingTool } from '../App';

interface CanvasProps {
  bgImage: string | null;
  fgImage: string | null;
  tool: DrawingTool;
  brushColor: string;
  brushSize: number;
}

export interface CanvasHandle {
  getCombinedCanvasAsBase64: () => string | null;
  reset: () => void;
  undo: () => void;
  redo: () => void;
}

const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;

export const CanvasComponent = forwardRef<CanvasHandle, CanvasProps>(({ bgImage, fgImage, tool, brushColor, brushSize }, ref) => {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const { history, currentHistoryIndex, pushHistory, undo, redo, resetHistory } = useCanvasHistory();

  const drawImageOnCanvas = (canvas: HTMLCanvasElement | null, imageUrl: string) => {
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.min(hRatio, vRatio);
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;
      ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    };
  };
  
  const clearCanvas = (canvas: HTMLCanvasElement | null) => {
    const ctx = canvas?.getContext('2d');
    ctx?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  useEffect(() => {
    if (bgImage) {
      drawImageOnCanvas(bgCanvasRef.current, bgImage);
    } else {
      clearCanvas(bgCanvasRef.current);
    }
  }, [bgImage]);

  useEffect(() => {
    if (fgImage) {
      drawImageOnCanvas(fgCanvasRef.current, fgImage);
    } else {
      clearCanvas(fgCanvasRef.current);
    }
  }, [fgImage]);

  useEffect(() => {
    const canvas = drawingCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (history[currentHistoryIndex]) {
      const img = new Image();
      img.src = history[currentHistoryIndex];
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
    }
  }, [history, currentHistoryIndex]);


  const getCoords = (e: React.MouseEvent<HTMLCanvasElement>): {x: number, y: number} => {
      const canvas = drawingCanvasRef.current;
      if (!canvas) return {x: 0, y: 0};
      const rect = canvas.getBoundingClientRect();
      return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
      };
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = drawingCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const {x, y} = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = drawingCanvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const {x, y} = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const canvas = drawingCanvasRef.current;
    if (!isDrawing || !canvas) return;
    
    setIsDrawing(false);
    const dataUrl = canvas.toDataURL('image/png');
    pushHistory(dataUrl);
  };

  const resetAllCanvases = useCallback(() => {
    clearCanvas(bgCanvasRef.current);
    clearCanvas(fgCanvasRef.current);
    clearCanvas(drawingCanvasRef.current);
    resetHistory();
  }, [resetHistory]);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const canvas = fgCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const MAX_DIM = canvas.width * 0.5;
            let drawWidth = img.width;
            let drawHeight = img.height;

            if (drawWidth > MAX_DIM || drawHeight > MAX_DIM) {
              if (drawWidth > drawHeight) {
                const ratio = MAX_DIM / drawWidth;
                drawWidth = MAX_DIM;
                drawHeight *= ratio;
              } else {
                const ratio = MAX_DIM / drawHeight;
                drawHeight = MAX_DIM;
                drawWidth *= ratio;
              }
            }

            const finalX = x - drawWidth / 2;
            const finalY = y - drawHeight / 2;

            ctx.drawImage(img, finalX, finalY, drawWidth, drawHeight);
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
      e.dataTransfer.clearData();
    }
  };


  useImperativeHandle(ref, () => ({
    getCombinedCanvasAsBase64: () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = CANVAS_WIDTH;
      tempCanvas.height = CANVAS_HEIGHT;
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) return null;

      if (bgCanvasRef.current) ctx.drawImage(bgCanvasRef.current, 0, 0);
      if (fgCanvasRef.current) ctx.drawImage(fgCanvasRef.current, 0, 0);
      if (drawingCanvasRef.current) ctx.drawImage(drawingCanvasRef.current, 0, 0);

      return tempCanvas.toDataURL('image/png');
    },
    reset: resetAllCanvases,
    undo: undo,
    redo: redo
  }));
  
  const cursorStyle = () => {
    if (tool === 'brush') return 'crosshair';
    if (tool === 'eraser') return 'cell'; 
    return 'default';
  }

  const canvasStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
  };

  return (
    <div 
      style={{ position: 'relative', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px`, aspectRatio: '1/1' }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <canvas ref={bgCanvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{...canvasStyle, zIndex: 1}} />
      <canvas ref={fgCanvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{...canvasStyle, zIndex: 2}} />
      <canvas
        ref={drawingCanvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{...canvasStyle, zIndex: 3, cursor: cursorStyle()}}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
    </div>
  );
});

CanvasComponent.displayName = 'CanvasComponent';