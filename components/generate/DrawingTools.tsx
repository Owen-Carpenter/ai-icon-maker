'use client';

import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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
  // Separate tools by category
  const sketchingTools = tools.filter(tool => tool.category === 'sketch');
  const shapeTools = tools.filter(tool => tool.category === 'shape');
  const utilityTools = tools.filter(tool => tool.category === 'utility');

  const currentShapeTool = shapeTools.find(tool => tool.id === currentTool);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
      <h3 className="text-white font-semibold mb-4">Drawing Tools</h3>
      
      {/* Sketching Tools */}
      <div className="space-y-2 mb-4">
        <h4 className="text-white text-sm font-medium mb-2">Sketching</h4>
        {sketchingTools.map((tool) => (
          <Button
            key={tool.id}
            onClick={() => setCurrentTool(tool.id)}
            variant={currentTool === tool.id ? "default" : "outline"}
            className="w-full justify-start"
            size="sm"
          >
            <span className="mr-2 text-lg">{tool.icon}</span>
            <span className="text-sm">{tool.name}</span>
          </Button>
        ))}
      </div>

      {/* Shape Tools Dropdown */}
      <div className="mb-4">
        <h4 className="text-white text-sm font-medium mb-2">Shapes</h4>
        <Select value={currentShapeTool?.id || ''} onValueChange={setCurrentTool}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a shape">
              {currentShapeTool && (
                <div className="flex items-center">
                  <span className="mr-2 text-lg">{currentShapeTool.icon}</span>
                  <span className="text-sm">{currentShapeTool.name}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {shapeTools.map((tool) => (
              <SelectItem key={tool.id} value={tool.id}>
                <div className="flex items-center">
                  <span className="mr-2 text-lg">{tool.icon}</span>
                  <span className="text-sm">{tool.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Utility Tools */}
      <div className="space-y-2 mb-6">
        <h4 className="text-white text-sm font-medium mb-2">Utilities</h4>
        {utilityTools.map((tool) => (
          <Button
            key={tool.id}
            onClick={() => setCurrentTool(tool.id)}
            variant={currentTool === tool.id ? "default" : "outline"}
            className="w-full justify-start"
            size="sm"
          >
            <span className="mr-2 text-lg">{tool.icon}</span>
            <span className="text-sm">{tool.name}</span>
          </Button>
        ))}
      </div>

      {/* Brush Settings */}
      <div className="space-y-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Brush Size: {brushSize}px
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
          <label className="block text-white text-sm font-medium mb-2">
            Color
          </label>
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            className="w-full h-10 rounded-lg border border-white/20 bg-white/10"
          />
        </div>
      </div>
    </div>
  );
} 