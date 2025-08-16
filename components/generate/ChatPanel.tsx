'use client';

import { useState } from 'react';

interface ChatPanelProps {
  currentPrompt: string;
  setCurrentPrompt: (prompt: string) => void;
  isGenerating: boolean;
  generatedImages: string[];
  onGenerate: (prompt: string, style: string, color: string) => void;
}

export default function ChatPanel({ 
  currentPrompt, 
  setCurrentPrompt, 
  isGenerating, 
  generatedImages, 
  onGenerate 
}: ChatPanelProps) {
  const [style, setStyle] = useState('modern');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPrompt.trim()) {
      onGenerate(currentPrompt, style, '#FF6C00'); // Default color, users can describe colors in prompt
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setCurrentPrompt(prompt);
  };

  return (
    <div className="w-96 bg-white/5 backdrop-blur-sm flex flex-col border-r border-white/10">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-sunset-500 to-coral-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Icon Assistant</h2>
            <p className="text-sunset-200 text-sm">Powered by Claude Sonnet 4.0</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="flex justify-start">
          <div className="bg-white/10 border border-white/20 rounded-lg p-3">
            <p className="text-white text-sm leading-relaxed">
              Hi! Describe the icon you'd like me to create, and I'll generate multiple variations for you.
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              <button 
                onClick={() => handleQuickPrompt('shopping cart icon')}
                className="text-xs px-2 py-1 bg-sunset-500/20 text-sunset-300 rounded-full hover:bg-sunset-500/30 transition-colors"
              >
                Shopping cart
              </button>
              <button 
                onClick={() => handleQuickPrompt('settings gear icon')}
                className="text-xs px-2 py-1 bg-sunset-500/20 text-sunset-300 rounded-full hover:bg-sunset-500/30 transition-colors"
              >
                Settings
              </button>
              <button 
                onClick={() => handleQuickPrompt('user profile icon')}
                className="text-xs px-2 py-1 bg-sunset-500/20 text-sunset-300 rounded-full hover:bg-sunset-500/30 transition-colors"
              >
                User profile
              </button>
            </div>
          </div>
        </div>
        
        {/* Generated Messages */}
        {currentPrompt && (
          <div className="flex justify-end">
            <div className="bg-gradient-to-r from-sunset-500 to-coral-500 rounded-lg p-3">
              <p className="text-white text-sm">{currentPrompt}</p>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/20 rounded-lg p-3">
              <p className="text-white text-sm">Creating variations...</p>
              <div className="mt-2 flex space-x-1">
                <div className="w-1.5 h-1.5 bg-sunset-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-sunset-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1.5 h-1.5 bg-sunset-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}

        {generatedImages.length > 0 && !isGenerating && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/20 rounded-lg p-3">
              <p className="text-white text-sm">✨ Generated {generatedImages.length} icons! Check them out →</p>
              <p className="text-sunset-200 text-xs mt-1">Want different variations?</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* Style Controls */}
          <div className="flex gap-2">
            <select 
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-2 text-white text-xs focus:outline-none focus:border-sunset-500 transition-colors [&>option]:bg-midnight-800 [&>option]:text-white [&>option]:border-none"
            >
              <option value="modern">Modern</option>
              <option value="flat">Flat</option>
              <option value="line-art">Line Art</option>
              <option value="3d">3D</option>
              <option value="vintage">Vintage</option>
              <option value="neon">Neon</option>
              <option value="minimalist">Minimalist</option>
              <option value="hand-drawn">Hand Drawn</option>
            </select>
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              placeholder="Describe your icon idea..."
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-sunset-300 focus:outline-none focus:border-sunset-500 transition-colors"
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={!currentPrompt.trim() || isGenerating}
              className="bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}