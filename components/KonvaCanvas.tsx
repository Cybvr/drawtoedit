import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Stage, Layer, Image as KonvaImage, Line } from 'react-konva';
import { useCanvasHistory } from '../hooks/useCanvasHistory';
import { DrawingTool } from '../App';
import Konva from 'konva';

interface KonvaCanvasProps {
  bgImage: string | null;
  fgImage: string | null;
  tool: DrawingTool;
  brushColor: string;
  brushSize: number;
}

export interface KonvaCanvasHandle {
  getCanvasAsBase64: () => string | null;
  reset: () => void;
  undo: () => void;
  redo: () => void;
}

const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;

export const KonvaCanvas = forwardRef<KonvaCanvasHandle, KonvaCanvasProps>(
  ({ bgImage, fgImage, tool, brushColor, brushSize }, ref) => {
    const stageRef = useRef<Konva.Stage>(null);
    const layerRef = useRef<Konva.Layer>(null);
    const [bgImageObj, setBgImageObj] = useState<HTMLImageElement | null>(null);
    const [fgImageObj, setFgImageObj] = useState<HTMLImageElement | null>(null);
    const [lines, setLines] = useState<any[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    
    const { history, currentHistoryIndex, pushHistory, undo, redo, resetHistory } = useCanvasHistory();

    // Load background image
    useEffect(() => {
      if (bgImage) {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => setBgImageObj(img);
        img.src = bgImage;
      } else {
        setBgImageObj(null);
      }
    }, [bgImage]);

    // Load foreground image
    useEffect(() => {
      if (fgImage) {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => setFgImageObj(img);
        img.src = fgImage;
      } else {
        setFgImageObj(null);
      }
    }, [fgImage]);

    const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (tool === 'select') return;
      
      setIsDrawing(true);
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      const newLine = {
        tool,
        points: [pos.x, pos.y],
        stroke: tool === 'eraser' ? '#000000' : brushColor,
        strokeWidth: brushSize,
        globalCompositeOperation: tool === 'eraser' ? 'destination-out' : 'source-over',
        lineCap: 'round',
        lineJoin: 'round',
      };
      
      setLines([...lines, newLine]);
    };

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!isDrawing || tool === 'select') return;

      const stage = e.target.getStage();
      const point = stage?.getPointerPosition();
      if (!point) return;

      const lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);

      setLines([...lines.slice(0, -1), lastLine]);
    };

    const handleMouseUp = () => {
      if (!isDrawing) return;
      setIsDrawing(false);
      
      // Save state to history
      const stage = stageRef.current;
      if (stage) {
        const dataUrl = stage.toDataURL();
        pushHistory(dataUrl);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new window.Image();
            img.onload = () => {
              setFgImageObj(img);
            };
            img.src = event.target?.result as string;
          };
          reader.readAsDataURL(file);
        }
      }
    };

    const resetCanvas = useCallback(() => {
      setLines([]);
      setBgImageObj(null);
      setFgImageObj(null);
      resetHistory();
    }, [resetHistory]);

    const undoAction = useCallback(() => {
      undo();
      // In a more complex implementation, you'd restore the canvas state from history
    }, [undo]);

    const redoAction = useCallback(() => {
      redo();
      // In a more complex implementation, you'd restore the canvas state from history
    }, [redo]);

    useImperativeHandle(ref, () => ({
      getCanvasAsBase64: () => {
        const stage = stageRef.current;
        return stage ? stage.toDataURL() : null;
      },
      reset: resetCanvas,
      undo: undoAction,
      redo: redoAction,
    }));

    const getImageDimensions = (img: HTMLImageElement) => {
      const hRatio = CANVAS_WIDTH / img.width;
      const vRatio = CANVAS_HEIGHT / img.height;
      const ratio = Math.min(hRatio, vRatio);
      const width = img.width * ratio;
      const height = img.height * ratio;
      const x = (CANVAS_WIDTH - width) / 2;
      const y = (CANVAS_HEIGHT - height) / 2;
      return { x, y, width, height };
    };

    return (
      <div
        className="w-full h-full"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Stage
          ref={stageRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          className="cursor-crosshair"
        >
          <Layer ref={layerRef}>
            {/* Background Image */}
            {bgImageObj && (
              <KonvaImage
                image={bgImageObj}
                {...getImageDimensions(bgImageObj)}
              />
            )}
            
            {/* Foreground Image */}
            {fgImageObj && (
              <KonvaImage
                image={fgImageObj}
                {...getImageDimensions(fgImageObj)}
                draggable={tool === 'select'}
              />
            )}
            
            {/* Drawing Lines */}
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap={line.lineCap}
                lineJoin={line.lineJoin}
                globalCompositeOperation={line.globalCompositeOperation}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    );
  }
);

KonvaCanvas.displayName = 'KonvaCanvas';