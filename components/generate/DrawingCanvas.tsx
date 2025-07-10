'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '../ui/button';

interface Point {
  x: number;
  y: number;
}

interface DrawingElement {
  id: string;
  type: 'pencil' | 'line' | 'rectangle' | 'circle' | 'stroke';
  points: Point[];
  color: string;
  size: number;
  bounds?: { x: number; y: number; width: number; height: number };
}

interface DrawingCanvasProps {
  currentTool: string;
  brushSize: number;
  brushColor: string;
  onClearCanvas: () => void;
}

export default function DrawingCanvas({ currentTool, brushSize, brushColor, onClearCanvas }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [drawingElements, setDrawingElements] = useState<DrawingElement[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });
  const [elementOffset, setElementOffset] = useState<Point>({ x: 0, y: 0 });
  const [needsRedraw, setNeedsRedraw] = useState(true);

  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, []);

  const generateId = useCallback(() => {
    return Math.random().toString(36).substring(2, 11);
  }, []);

  const calculateBounds = useCallback((points: Point[]): { x: number; y: number; width: number; height: number } => {
    if (points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
    
    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));
    
    return {
      x: minX - 5, // Add padding for easier selection
      y: minY - 5,
      width: maxX - minX + 10,
      height: maxY - minY + 10
    };
  }, []);

  const isPointInBounds = useCallback((point: Point, bounds: { x: number; y: number; width: number; height: number }): boolean => {
    return point.x >= bounds.x && 
           point.x <= bounds.x + bounds.width && 
           point.y >= bounds.y && 
           point.y <= bounds.y + bounds.height;
  }, []);

  const findElementAtPoint = useCallback((point: Point): string | null => {
    // Check from top to bottom (reverse order)
    for (let i = drawingElements.length - 1; i >= 0; i--) {
      const element = drawingElements[i];
      if (element.bounds && isPointInBounds(point, element.bounds)) {
        return element.id;
      }
    }
    return null;
  }, [drawingElements, isPointInBounds]);

  const drawElement = useCallback((ctx: CanvasRenderingContext2D, element: DrawingElement) => {
    ctx.save();
    ctx.strokeStyle = element.color;
    ctx.fillStyle = element.color;
    ctx.lineWidth = element.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over';

    switch (element.type) {
      case 'pencil':
      case 'stroke':
        if (element.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          for (let i = 1; i < element.points.length; i++) {
            ctx.lineTo(element.points[i].x, element.points[i].y);
          }
          ctx.stroke();
        } else if (element.points.length === 1) {
          // Draw a single point
          ctx.beginPath();
          ctx.arc(element.points[0].x, element.points[0].y, element.size / 2, 0, 2 * Math.PI);
          ctx.fill();
        }
        break;
      
      case 'line':
        if (element.points.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          ctx.lineTo(element.points[1].x, element.points[1].y);
          ctx.stroke();
        }
        break;
      
      case 'rectangle':
        if (element.points.length >= 2) {
          const width = element.points[1].x - element.points[0].x;
          const height = element.points[1].y - element.points[0].y;
          ctx.strokeRect(element.points[0].x, element.points[0].y, width, height);
        }
        break;
      
      case 'circle':
        if (element.points.length >= 2) {
          const radius = Math.sqrt(
            Math.pow(element.points[1].x - element.points[0].x, 2) + 
            Math.pow(element.points[1].y - element.points[0].y, 2)
          );
          ctx.beginPath();
          ctx.arc(element.points[0].x, element.points[0].y, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
        break;
    }
    ctx.restore();
  }, []);

  const drawSelectionBounds = useCallback((ctx: CanvasRenderingContext2D, bounds: { x: number; y: number; width: number; height: number }) => {
    ctx.save();
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    ctx.restore();
  }, []);

  const redrawCanvas = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !needsRedraw) return;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw all elements
    drawingElements.forEach(element => {
      drawElement(ctx, element);
    });

    // Draw current element being drawn
    if (currentElement) {
      drawElement(ctx, currentElement);
    }

    // Draw selection bounds
    if (selectedElement) {
      const element = drawingElements.find(el => el.id === selectedElement);
      if (element && element.bounds) {
        drawSelectionBounds(ctx, element.bounds);
      }
    }

    setNeedsRedraw(false);
  }, [drawingElements, currentElement, selectedElement, drawElement, drawSelectionBounds, needsRedraw]);

  // Use requestAnimationFrame for smooth rendering
  useEffect(() => {
    if (needsRedraw) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(redrawCanvas);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [redrawCanvas, needsRedraw]);

  // Initialize canvas
  useEffect(() => {
    setNeedsRedraw(true);
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    if (currentTool === 'hand') {
      const elementId = findElementAtPoint(pos);
      if (elementId) {
        setSelectedElement(elementId);
        setIsDragging(true);
        setDragStart(pos);
        
        const element = drawingElements.find(el => el.id === elementId);
        if (element && element.bounds) {
          setElementOffset({
            x: pos.x - element.bounds.x,
            y: pos.y - element.bounds.y
          });
        }
      } else {
        setSelectedElement(null);
        setNeedsRedraw(true);
      }
      return;
    }

    if (currentTool === 'eraser') {
      const elementId = findElementAtPoint(pos);
      if (elementId) {
        setDrawingElements(prev => prev.filter(el => el.id !== elementId));
        setSelectedElement(null);
        setNeedsRedraw(true);
      }
      return;
    }

    if (currentTool === 'fill') {
      // Fill functionality would go here
      return;
    }

    // Start drawing new element
    setIsDrawing(true);
    setSelectedElement(null);
    
    const newElement: DrawingElement = {
      id: generateId(),
      type: currentTool as 'pencil' | 'line' | 'rectangle' | 'circle',
      points: [pos],
      color: brushColor,
      size: brushSize
    };
    
    setCurrentElement(newElement);
    setNeedsRedraw(true);
  }, [currentTool, getMousePos, findElementAtPoint, drawingElements, generateId, brushColor, brushSize]);

  const continueDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    if (currentTool === 'hand' && isDragging && selectedElement) {
      const deltaX = pos.x - dragStart.x;
      const deltaY = pos.y - dragStart.y;
      
      setDrawingElements(prev => prev.map(element => {
        if (element.id === selectedElement) {
          const newPoints = element.points.map(point => ({
            x: point.x + deltaX,
            y: point.y + deltaY
          }));
          const newBounds = calculateBounds(newPoints);
          return {
            ...element,
            points: newPoints,
            bounds: newBounds
          };
        }
        return element;
      }));
      
      setDragStart(pos);
      setNeedsRedraw(true);
      return;
    }

    if (!isDrawing || !currentElement) return;

    if (currentTool === 'pencil') {
      setCurrentElement(prev => prev ? {
        ...prev,
        points: [...prev.points, pos]
      } : null);
    } else {
      // For shapes, update the second point
      setCurrentElement(prev => prev ? {
        ...prev,
        points: [prev.points[0], pos]
      } : null);
    }
    setNeedsRedraw(true);
  }, [currentTool, getMousePos, isDragging, selectedElement, isDrawing, currentElement, dragStart, calculateBounds]);

  const stopDrawing = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      return;
    }

    if (isDrawing && currentElement) {
      const finalElement = {
        ...currentElement,
        bounds: calculateBounds(currentElement.points)
      };
      
      setDrawingElements(prev => [...prev, finalElement]);
      setCurrentElement(null);
      setNeedsRedraw(true);
    }
    
    setIsDrawing(false);
  }, [isDragging, isDrawing, currentElement, calculateBounds]);

  const clearCanvas = useCallback(() => {
    setDrawingElements([]);
    setSelectedElement(null);
    setCurrentElement(null);
    setNeedsRedraw(true);
    onClearCanvas();
  }, [onClearCanvas]);

  const deleteSelected = useCallback(() => {
    if (selectedElement) {
      setDrawingElements(prev => prev.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
      setNeedsRedraw(true);
    }
  }, [selectedElement]);

  const getCursorStyle = useCallback(() => {
    switch (currentTool) {
      case 'pencil':
        return 'crosshair';
      case 'eraser':
        return 'grab';
      case 'fill':
        return 'copy';
      case 'hand':
        return isDragging ? 'grabbing' : 'grab';
      case 'line':
      case 'rectangle':
      case 'circle':
        return 'crosshair';
      default:
        return 'default';
    }
  }, [currentTool, isDragging]);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
      <div className="bg-white rounded-lg p-4">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={continueDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border border-gray-300 rounded-lg w-full h-auto"
          style={{ 
            maxWidth: '100%', 
            height: 'auto',
            cursor: getCursorStyle(),
            imageRendering: 'pixelated' // Improve rendering performance
          }}
        />
      </div>
      
      {/* Canvas Controls */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-white text-sm">
          Tool: <span className="font-semibold capitalize">{currentTool}</span>
          {currentTool !== 'fill' && currentTool !== 'hand' && (
            <span className="ml-2">Size: {brushSize}px</span>
          )}
          {currentTool === 'hand' && selectedElement && (
            <span className="ml-2">Selected</span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm">
            Save Draft
          </Button>
          <Button variant="outline" size="sm">
            Export PNG
          </Button>
          {selectedElement && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={deleteSelected}
              className="flex items-center space-x-1"
            >
              <span>🗑️</span>
              <span>Delete</span>
            </Button>
          )}
          <Button variant="destructive" size="sm" onClick={clearCanvas}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
} 