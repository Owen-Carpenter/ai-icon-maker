'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  status?: 'typing' | 'complete';
}

interface AIChatPanelProps {
  generatedImages: string[];
  isGenerating: boolean;
  onRegenerateVariations: () => void;
  onSelectImage: (imageUrl: string) => void;
  currentPrompt?: string;
}

export default function AIChatPanel({ 
  generatedImages, 
  isGenerating, 
  onRegenerateVariations,
  onSelectImage,
  currentPrompt
}: AIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI icon assistant. I'll help you create amazing icons and provide feedback throughout the process. What would you like to create?",
      timestamp: new Date(),
      status: 'complete'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add AI feedback when generation starts
  useEffect(() => {
    if (isGenerating && currentPrompt) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: `Great! I'm analyzing your prompt: "${currentPrompt}". Let me break this down and start generating your icons...`,
        timestamp: new Date(),
        status: 'typing'
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(true);

      // Simulate typing and progress updates
      const progressMessages = [
        "🎨 Analyzing your design requirements...",
        "🤖 Selecting the best AI model for your style...",
        "⚡ Generating multiple variations...",
        "🎯 Optimizing for icon clarity and scalability...",
        "✨ Adding final touches and details..."
      ];

      progressMessages.forEach((msg, index) => {
        setTimeout(() => {
          const progressMessage: ChatMessage = {
            id: `progress-${Date.now()}-${index}`,
            type: 'ai',
            content: msg,
            timestamp: new Date(),
            status: 'typing'
          };
          setMessages(prev => [...prev, progressMessage]);
        }, (index + 1) * 1500);
      });
    }
  }, [isGenerating, currentPrompt]);

  // Add completion message when generation finishes
  useEffect(() => {
    if (!isGenerating && generatedImages.length > 0) {
      setIsTyping(false);
      const completionMessage: ChatMessage = {
        id: `complete-${Date.now()}`,
        type: 'ai',
        content: `🎉 Perfect! I've generated ${generatedImages.length} icon variations for you. Each one has been optimized for clarity and professional use. Click on any icon below to select it, or ask me to generate new variations with different styles!`,
        timestamp: new Date(),
        status: 'complete'
      };
      setMessages(prev => [...prev, completionMessage]);
    }
  }, [isGenerating, generatedImages.length]);

  const handleRegenerateWithFeedback = () => {
    const regenerateMessage: ChatMessage = {
      id: `regen-${Date.now()}`,
      type: 'ai',
      content: "I'll create some fresh variations for you! Let me try different approaches and styles to give you more options...",
      timestamp: new Date(),
      status: 'complete'
    };
    setMessages(prev => [...prev, regenerateMessage]);
    onRegenerateVariations();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Assistant</h3>
            <p className="text-white/60 text-xs">Icon Generation Expert</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white/60 text-xs">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/20 text-white border border-white/30'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-60">
                  {formatTime(message.timestamp)}
                </span>
                {message.status === 'typing' && (
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/20 text-white border border-white/30 rounded-lg p-3 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-xs opacity-60">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Generated Images Display */}
      {generatedImages.length > 0 && (
        <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/20">
          <h4 className="text-white text-sm font-medium mb-3">Generated Icons</h4>
          <div className="grid grid-cols-2 gap-2">
            {generatedImages.map((imageUrl, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-2 border border-gray-200 hover:border-orange-500 transition-colors cursor-pointer group"
                onClick={() => onSelectImage(imageUrl)}
              >
                <img
                  src={imageUrl}
                  alt={`Generated icon ${index + 1}`}
                  className="w-full h-16 object-contain rounded"
                />
                <div className="mt-1 text-center">
                  <span className="text-xs text-gray-600 group-hover:text-orange-600 transition-colors">
                    Select
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          onClick={handleRegenerateWithFeedback}
          disabled={isGenerating}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          size="sm"
        >
          {isGenerating ? 'Generating...' : '🎲 Generate New Variations'}
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-white border-white/30 hover:bg-white/10"
            onClick={() => {
              const helpMessage: ChatMessage = {
                id: `help-${Date.now()}`,
                type: 'ai',
                content: "I can help you create icons in different styles! Try prompts like 'minimalist shopping cart', 'colorful heart icon', or 'modern settings gear'. I'll analyze your needs and suggest the best approach for each design.",
                timestamp: new Date(),
                status: 'complete'
              };
              setMessages(prev => [...prev, helpMessage]);
            }}
          >
            💡 Tips
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-white border-white/30 hover:bg-white/10"
            onClick={() => {
              const styleMessage: ChatMessage = {
                id: `styles-${Date.now()}`,
                type: 'ai',
                content: "I can create icons in various styles: Modern (clean lines), Minimalist (simple shapes), Detailed (rich textures), Flat Design (2D style), Line Art (outline only), or Gradient (color transitions). What style appeals to you?",
                timestamp: new Date(),
                status: 'complete'
              };
              setMessages(prev => [...prev, styleMessage]);
            }}
          >
            🎨 Styles
          </Button>
        </div>
      </div>
    </div>
  );
} 