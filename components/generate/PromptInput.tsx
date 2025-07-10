'use client';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function PromptInput({ prompt, setPrompt, onGenerate, isGenerating }: PromptInputProps) {
  return (
    <div className="max-w-4xl mx-auto mb-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
        <div className="flex space-x-4">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the icon you want to create (e.g., 'A modern shopping cart icon with clean lines')"
            className="flex-1 h-12"
          />
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            size="lg"
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </div>
    </div>
  );
} 