'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Send, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  status?: 'typing' | 'complete';
}

interface AIChatInterfaceProps {
  onGenerate: (prompt: string, style: string, color: string) => void;
  isGenerating: boolean;
  currentPrompt?: string;
}

export default function AIChatInterface({ onGenerate, isGenerating, currentPrompt }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI icon assistant. Describe the icon you'd like me to create, and I'll generate it for you. You can be as detailed or simple as you want!",
      timestamp: new Date(),
      status: 'complete'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [style, setStyle] = useState('modern');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const iconStyles = [
    { value: 'modern', label: 'Modern', description: 'Clean and contemporary design' },
    { value: 'flat', label: 'Flat', description: 'Minimalist flat design' },
    { value: 'metallic', label: 'Metallic', description: 'Shiny metallic finish' },
    { value: 'cartoon', label: 'Cartoon', description: 'Fun and playful style' },
    { value: 'pictogram', label: 'Pictogram', description: 'Simple symbolic representation' },
    { value: 'line-art', label: 'Line Art', description: 'Outline style with clean lines' },
    { value: '3d', label: '3D', description: 'Three-dimensional appearance' },
    { value: 'vintage', label: 'Vintage', description: 'Retro and classic style' },
    { value: 'neon', label: 'Neon', description: 'Glowing neon effect' },
    { value: 'hand-drawn', label: 'Hand-drawn', description: 'Sketchy, artistic style' }
  ];

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add AI feedback when generation starts
  useEffect(() => {
    if (isGenerating && currentPrompt) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: `Perfect! I'm creating your "${currentPrompt}" icon in ${iconStyles.find(s => s.value === style)?.label} style. Let me work on that for you...`,
        timestamp: new Date(),
        status: 'typing'
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(true);

      // Simulate typing and progress updates
      const progressMessages = [
        "🎨 Analyzing your design requirements...",
        "🤖 Selecting the best AI model for your style...",
        "⚡ Generating your icon...",
        "🎯 Optimizing for clarity and scalability...",
        "✨ Adding final touches..."
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
        }, (index + 1) * 1000);
      });
    }
  }, [isGenerating, currentPrompt, style]);

  // Add completion message when generation finishes
  useEffect(() => {
    if (!isGenerating && currentPrompt) {
      setIsTyping(false);
      const completionMessage: ChatMessage = {
        id: `complete-${Date.now()}`,
        type: 'ai',
        content: `🎉 Your icon is ready! I've created a beautiful ${iconStyles.find(s => s.value === style)?.label} style icon based on your description. Check it out on the right side!`,
        timestamp: new Date(),
        status: 'complete'
      };
      setMessages(prev => [...prev, completionMessage]);
    }
  }, [isGenerating, currentPrompt, style]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      status: 'complete'
    };
    setMessages(prev => [...prev, userMessage]);

    // Generate icon
    onGenerate(inputValue, style, primaryColor);
    setInputValue('');
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4 border-b border-white/20">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold">AI Icon Assistant</h3>
          <p className="text-white/60 text-xs">Powered by advanced AI</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white'
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
            <div className="bg-white/20 text-white border border-white/30 rounded-lg p-3 max-w-[85%]">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-xs opacity-60">AI is working...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {!isGenerating && messages.length <= 2 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-white/60 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {['shopping cart', 'heart icon', 'settings gear', 'home house'].map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-full border border-white/20 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="p-4 border-t border-white/20">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Style and Color Controls */}
          <div className="flex gap-2">
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="flex-1 h-9 text-xs">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                {iconStyles.map((iconStyle) => (
                  <SelectItem key={iconStyle.value} value={iconStyle.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{iconStyle.label}</span>
                      <span className="text-xs text-gray-400">{iconStyle.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-12 h-9 rounded-lg border border-white/20 bg-white/10 cursor-pointer"
              title="Choose primary color"
            />
          </div>

          {/* Text Input */}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe your icon idea..."
              className="flex-1 h-10 text-sm"
              disabled={isGenerating}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isGenerating}
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 