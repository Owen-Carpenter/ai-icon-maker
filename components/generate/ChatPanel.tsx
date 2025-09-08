'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isImprovement?: boolean;
}

interface ChatPanelProps {
  currentPrompt: string;
  setCurrentPrompt: (prompt: string) => void;
  isGenerating: boolean;
  generatedImages: string[];
  onGenerate: (prompt: string, style: string, color: string) => void;
  isImprovementMode?: boolean;
  selectedIconUrl?: string;
  onExitImprovementMode?: () => void;
  hasUserTakenAction?: boolean;
  conversationHistory?: ChatMessage[];
}

export default function ChatPanel({ 
  currentPrompt, 
  setCurrentPrompt, 
  isGenerating, 
  generatedImages, 
  onGenerate,
  isImprovementMode = false,
  selectedIconUrl,
  onExitImprovementMode,
  hasUserTakenAction = true,
  conversationHistory = []
}: ChatPanelProps) {
  const [style, setStyle] = useState('modern');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, isGenerating]);

  // Helper function to format icon title
  const formatIconTitle = (prompt: string) => {
    if (!prompt.trim()) return 'Icon Assistant';
    const words = prompt.trim().split(' ');
    if (words.length <= 3) return prompt.trim();
    return words.slice(0, 3).join(' ') + '...';
  };

  // Helper function to clean message content (remove credit counts)
  const cleanMessageContent = (content: string) => {
    // Remove credit count patterns like "68!" or "69!" at the end
    return content.replace(/\s+\d+!?\s*$/, '').trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPrompt.trim()) {
      onGenerate(currentPrompt, style, '#FF6C00'); // Default color, users can describe colors in prompt
    }
  };



  return (
      <div 
        data-walkthrough="chat-panel"
        className="w-full lg:w-96 lg:flex-shrink-0 bg-white/5 backdrop-blur-sm flex flex-col border-r-0 lg:border-r border-b lg:border-b-0 border-white/10 h-full lg:h-full lg:min-h-0"
      >
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">
              {formatIconTitle(currentPrompt)}
            </h2>
            <p className="text-sunset-200 text-sm">
              {isImprovementMode ? 'Describe how to improve this icon' : 'Powered by Claude Sonnet 4.0'}
            </p>
          </div>
          {isImprovementMode && onExitImprovementMode && (
            <button
              onClick={onExitImprovementMode}
              className="text-sunset-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent relative">
        {/* Scroll indicator - subtle fade at top */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-10"></div>
        {/* Initial assistant message */}
        {conversationHistory.length === 0 && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/20 rounded-lg p-3">
              <p className="text-white text-sm leading-relaxed">
                {isImprovementMode 
                  ? 'I can see the icon you want to improve! Describe what changes you\'d like me to make.'
                  : 'Hi! Describe the icon you\'d like me to create, and I\'ll generate multiple variations for you.'
                }
              </p>
            </div>
          </div>
        )}

        {/* Show selected icon in improvement mode */}
        {isImprovementMode && selectedIconUrl && conversationHistory.length === 0 && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/20 rounded-lg p-3">
              <p className="text-white text-sm mb-2">Selected icon to improve:</p>
              <img 
                src={selectedIconUrl} 
                alt="Icon to improve" 
                className="w-16 h-16 object-contain bg-white/5 rounded-lg"
              />
            </div>
          </div>
        )}
        
        {/* Conversation History */}
        {conversationHistory.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg p-3 ${
              message.type === 'user' 
                ? 'bg-gradient-to-r from-sunset-500 to-coral-500' 
                : 'bg-white/10 border border-white/20'
            }`}>
              <p className="text-white text-sm">
                {cleanMessageContent(message.content)}
                {message.isImprovement && (
                  <span className="text-xs text-sunset-200 ml-2">(improvement)</span>
                )}
              </p>
            </div>
          </div>
        ))}

        {/* Current prompt being typed - only show if not empty and not already in history */}
        {currentPrompt.trim() && !conversationHistory.some(msg => msg.content === currentPrompt.trim()) && (
          <div className="flex justify-end">
            <div className="bg-gradient-to-r from-sunset-500 to-coral-500 rounded-lg p-3">
              <p className="text-white text-sm">{currentPrompt}</p>
            </div>
          </div>
        )}

        {/* Generating indicator */}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/20 rounded-lg p-3">
              <p className="text-white text-sm">
                {isImprovementMode ? 'Improving your icon...' : 'Creating variations...'}
              </p>
              <div className="mt-2 flex space-x-1">
                <div className="w-1.5 h-1.5 bg-sunset-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-sunset-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1.5 h-1.5 bg-sunset-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}

        {/* Success message */}
        {generatedImages.length > 0 && !isGenerating && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/20 rounded-lg p-3">
              <p className="text-white text-sm">
                ✨ {isImprovementMode ? 'Icon improved!' : `Generated ${generatedImages.length} icons!`} Check them out →
              </p>
              <p className="text-sunset-200 text-xs mt-1">
                {isImprovementMode ? 'How else would you like to improve it?' : 
                 hasUserTakenAction ? 'Want different variations?' : 'Please choose an action for one of your icons first!'}
              </p>
            </div>
          </div>
        )}
        
        {/* Scroll indicator - subtle fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"></div>
        
        {/* Auto-scroll target */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* Style Controls */}
          <div className="flex gap-2">
            <select 
              data-walkthrough="style-selector"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              disabled={isGenerating || (!hasUserTakenAction && generatedImages.length > 0 && !isImprovementMode)}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-2 text-white text-xs focus:outline-none focus:border-sunset-500 transition-colors [&>option]:bg-midnight-800 [&>option]:text-white [&>option]:border-none disabled:opacity-50"
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
              data-walkthrough="prompt-input"
              type="text"
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              placeholder={
                !hasUserTakenAction && generatedImages.length > 0 && !isImprovementMode 
                  ? "Choose an action for your icons first..." 
                  : isImprovementMode 
                    ? "Describe how to improve this icon..." 
                    : "Describe your icon idea..."
              }
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-sunset-300 focus:outline-none focus:border-sunset-500 transition-colors disabled:opacity-50"
              disabled={isGenerating || (!hasUserTakenAction && generatedImages.length > 0 && !isImprovementMode)}
            />
            <button
              data-walkthrough="generate-button"
              type="submit"
              disabled={!currentPrompt.trim() || isGenerating || (!hasUserTakenAction && generatedImages.length > 0 && !isImprovementMode)}
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