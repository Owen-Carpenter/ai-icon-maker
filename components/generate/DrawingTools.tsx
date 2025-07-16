'use client';

import { Button } from '../ui/button';
import { Slider } from '../ui/slider';

interface DrawingTool {
  id: string;
  name: string;
  icon: string;
  category: 'sketch' | 'shape' | 'utility';
}

interface DrawingToolsProps {
  tools: DrawingTool[];
  currentTool: string;
  setCurrentTool: (tool: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  onClearCanvas: () => void;
}

export default function DrawingTools({
  tools,
  currentTool,
  setCurrentTool,
  brushSize,
  setBrushSize,
  brushColor,
  setBrushColor,
  onClearCanvas
}: DrawingToolsProps) {

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 h-full flex flex-col overflow-hidden">
      <h3 className="text-white font-semibold mb-3 text-sm">Drawing Tools</h3>
      
      {/* All Tools Grid */}
      <div className="mb-3 flex-shrink-0">
        <h4 className="text-white text-xs font-medium mb-2">Tools</h4>
        <div className="grid grid-cols-3 gap-1.5">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setCurrentTool(tool.id)}
              className={`p-2 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                currentTool === tool.id
                  ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                  : 'border-white/20 hover:border-white/40 text-white hover:bg-white/10'
              }`}
              title={tool.name}
            >
              <span className="text-lg">{tool.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brush Settings */}
      <div className="space-y-2 mt-auto flex-shrink-0">
        <div>
          <label className="block text-white text-xs font-medium mb-1">
            Size: {brushSize}px
          </label>
          <Slider
            value={[brushSize]}
            onValueChange={(value) => setBrushSize(value[0])}
            max={50}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-white text-xs font-medium mb-1">
            Color
          </label>
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            className="w-full h-6 rounded-md border border-white/20 bg-white/10 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
} 