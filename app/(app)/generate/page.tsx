'use client';

import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import PromptInput from '../../../components/generate/PromptInput';
import DrawingTools from '../../../components/generate/DrawingTools';
import DrawingCanvas from '../../../components/generate/DrawingCanvas';
import GenerationPanel from '../../../components/generate/GenerationPanel';

interface DrawingTool {
  id: string;
  name: string;
  icon: string;
  category: 'sketch' | 'shape' | 'utility';
}

export default function GeneratePage() {
  const [currentTool, setCurrentTool] = useState('pencil');
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const tools: DrawingTool[] = [
    // Sketching tools
    { id: 'pencil', name: 'Pencil', icon: '✏️', category: 'sketch' },
    { id: 'eraser', name: 'Eraser', icon: '🧽', category: 'sketch' },
    
    // Shape tools
    { id: 'line', name: 'Line', icon: '📏', category: 'shape' },
    { id: 'rectangle', name: 'Rectangle', icon: '⬜', category: 'shape' },
    { id: 'circle', name: 'Circle', icon: '⭕', category: 'shape' },
    
    // Utility tools
    { id: 'fill', name: 'Fill', icon: '🎨', category: 'utility' },
    { id: 'hand', name: 'Hand', icon: '✋', category: 'utility' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock generated images - in real app, these would come from AI API
      const mockImages = [
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2QzAwIi8+Cjwvc3ZnPgo=',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRjZDMDAiLz4KPC9zdmc+Cg==',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iI0ZGNkMwMCIvPgo8L3N2Zz4K'
      ];
      
      setGeneratedImages(mockImages);
      setIsGenerating(false);
    }, 3000);
  };

  const handleClearCanvas = () => {
    // Canvas clearing is handled by the DrawingCanvas component
  };

  const handleRegenerateVariations = () => {
    if (generatedImages.length > 0) {
      handleGenerate();
    }
  };

  const handleSelectImage = (imageUrl: string) => {
    // Handle image selection - could load into canvas or save to library
    console.log('Selected image:', imageUrl);
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">AI Icon Generator</h1>
          <p className="text-sunset-200">Create amazing icons with AI assistance and drawing tools</p>
        </div>

        {/* AI Prompt Input */}
        <PromptInput
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        {/* Main Interface */}
        <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Left Panel - Drawing Tools */}
          <div className="col-span-12 lg:col-span-2">
            <DrawingTools
              tools={tools}
              currentTool={currentTool}
              setCurrentTool={setCurrentTool}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              brushColor={brushColor}
              setBrushColor={setBrushColor}
              onClearCanvas={handleClearCanvas}
            />
          </div>

          {/* Center Panel - Drawing Canvas */}
          <div className="col-span-12 lg:col-span-7">
            <DrawingCanvas
              currentTool={currentTool}
              brushSize={brushSize}
              brushColor={brushColor}
              onClearCanvas={handleClearCanvas}
            />
          </div>

          {/* Right Panel - Generated Icons */}
          <div className="col-span-12 lg:col-span-3">
            <GenerationPanel
              generatedImages={generatedImages}
              isGenerating={isGenerating}
              onRegenerateVariations={handleRegenerateVariations}
              onSelectImage={handleSelectImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 