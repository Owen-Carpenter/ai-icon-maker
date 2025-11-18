'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface WalkthroughStep {
  id: string;
  target: string; // CSS selector or element ID
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'none';
  nextButton?: string;
  skipButton?: string;
}

interface WalkthroughProps {
  steps: WalkthroughStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function Walkthrough({ steps, isActive, onComplete, onSkip }: WalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Calculate tooltip position based on target element and desired position
  const calculateTooltipPosition = (target: HTMLElement, position: string) => {
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltipRef.current?.getBoundingClientRect();
    
    if (!tooltipRect) return { x: 0, y: 0 };

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
        y = targetRect.top - tooltipRect.height - 16;
        break;
      case 'bottom':
        x = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
        y = targetRect.bottom + 16;
        break;
      case 'left':
        x = targetRect.left - tooltipRect.width - 16;
        y = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
        break;
      case 'right':
        x = targetRect.right + 16;
        y = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
        break;
      case 'center':
        x = window.innerWidth / 2 - tooltipRect.width / 2;
        y = window.innerHeight / 2 - tooltipRect.height / 2;
        break;
    }

    // Keep tooltip within viewport bounds
    x = Math.max(16, Math.min(x, window.innerWidth - tooltipRect.width - 16));
    y = Math.max(16, Math.min(y, window.innerHeight - tooltipRect.height - 16));

    return { x, y };
  };

  // Reset to first step when walkthrough becomes active
  useEffect(() => {
    if (isActive) {
      setCurrentStep(0);
    }
  }, [isActive]);

  // Update target element and position when step changes
  useEffect(() => {
    if (!isActive || !steps[currentStep]) return;

    const step = steps[currentStep];
    const target = document.querySelector(step.target) as HTMLElement;
    
    if (target) {
      setTargetElement(target);
      
      // Wait for tooltip to render before calculating position
      setTimeout(() => {
        const position = calculateTooltipPosition(target, step.position);
        setTooltipPosition(position);
      }, 10);
    }
  }, [currentStep, isActive, steps]);

  // Handle window resize
  useEffect(() => {
    if (!isActive || !targetElement) return;

    const handleResize = () => {
      const step = steps[currentStep];
      if (step && targetElement) {
        const position = calculateTooltipPosition(targetElement, step.position);
        setTooltipPosition(position);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentStep, isActive, targetElement, steps]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipWalkthrough = () => {
    onSkip();
  };

  if (!isActive || !steps[currentStep]) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <>
      {/* Overlay with backdrop blur */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm z-[9998] transition-all duration-500 animate-in fade-in">
        {/* Spotlight effect around target element */}
        {targetElement && (
          <>
            {/* Animated highlight ring */}
            <div
              className="absolute rounded-xl transition-all duration-300"
              style={{
                left: targetElement.getBoundingClientRect().left - 12,
                top: targetElement.getBoundingClientRect().top - 12,
                width: targetElement.getBoundingClientRect().width + 24,
                height: targetElement.getBoundingClientRect().height + 24,
                background: 'radial-gradient(circle, rgba(251, 146, 60, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />
            {/* Glowing border */}
            <div
              className="absolute rounded-xl border-2 border-sunset-400/60 shadow-[0_0_30px_rgba(251,146,60,0.4)] transition-all duration-300"
              style={{
                left: targetElement.getBoundingClientRect().left - 8,
                top: targetElement.getBoundingClientRect().top - 8,
                width: targetElement.getBoundingClientRect().width + 16,
                height: targetElement.getBoundingClientRect().height + 16,
                pointerEvents: 'none',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            />
            {/* Inner highlight */}
            <div
              className="absolute rounded-lg border border-white/20 transition-all duration-300"
              style={{
                left: targetElement.getBoundingClientRect().left - 4,
                top: targetElement.getBoundingClientRect().top - 4,
                width: targetElement.getBoundingClientRect().width + 8,
                height: targetElement.getBoundingClientRect().height + 8,
                pointerEvents: 'none'
              }}
            />
          </>
        )}
      </div>

      {/* Enhanced Tooltip Card with Glassmorphism */}
      <div
        ref={tooltipRef}
        className="fixed z-[9999] bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-7 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300 ring-1 ring-white/20"
        style={{
          left: tooltipPosition.x,
          top: tooltipPosition.y,
          transform: 'translateZ(0)',
          boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.3)'
        }}
      >

         {/* Step indicator */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-sunset-500 to-coral-500 rounded-full shadow-sm">
              <span className="text-white text-xs font-bold">
                {currentStep + 1}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-white/90 uppercase tracking-wide drop-shadow-sm">
                Step {currentStep + 1} of {steps.length}
              </span>
              <div className="flex space-x-1 mt-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? 'w-6 bg-sunset-500'
                        : index < currentStep
                        ? 'w-3 bg-sunset-300'
                        : 'w-3 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={skipWalkthrough}
            className="text-white/70 hover:text-white text-xs font-semibold transition-all duration-300 px-3 py-1.5 rounded-lg hover:bg-white/20 hover:backdrop-blur-md"
          >
            ✕ Skip
          </button>
        </div>

        {/* Content with icon */}
        <div className="mb-6">
          <div className="flex items-start space-x-3 mb-3">
            <div className="flex-shrink-0 w-10 h-10 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/40">
              <span className="text-xl">
                {currentStep === 0 ? '👋' : currentStep === steps.length - 1 ? '🎉' : '💡'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white drop-shadow-sm mb-2 leading-tight">
                {step.title}
              </h3>
            </div>
          </div>
          <p className="text-white/90 text-sm leading-relaxed pl-13 drop-shadow-sm">
            {step.content}
          </p>
        </div>

        {/* Action buttons with better styling */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-1 text-white/70 hover:text-white text-sm font-semibold transition-all duration-300 px-4 py-2 rounded-xl hover:bg-white/20 hover:backdrop-blur-md disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent group border border-transparent hover:border-white/30"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
          
          <button
            onClick={nextStep}
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-500/90 to-pink-500/90 hover:from-orange-500 hover:to-pink-500 text-white px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 group border border-white/20 hover:border-white/40"
          >
            <span>{isLastStep ? '🎯 Finish Tour' : step.nextButton || 'Continue'}</span>
            {!isLastStep && (
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>

        {/* Enhanced pointer arrow with glassmorphism */}
        {step.position !== 'center' && (
          <>
            <div
              className={`absolute w-4 h-4 bg-white/20 backdrop-blur-xl border-white/30 transform rotate-45 ${
                step.position === 'top'
                  ? 'bottom-[-8px] left-1/2 -translate-x-1/2 border-b border-r'
                  : step.position === 'bottom'
                  ? 'top-[-8px] left-1/2 -translate-x-1/2 border-t border-l'
                  : step.position === 'left'
                  ? 'right-[-8px] top-1/2 -translate-y-1/2 border-t border-r'
                  : step.position === 'right'
                  ? 'left-[-8px] top-1/2 -translate-y-1/2 border-b border-l'
                  : ''
              }`}
            />
          </>
        )}
      </div>
    </>
  );
}

// Hook for managing walkthrough state
export function useWalkthrough() {
  const [isActive, setIsActive] = useState(false);

  const startWalkthrough = () => {
    setIsActive(true);
  };

  const completeWalkthrough = () => {
    setIsActive(false);
  };

  const skipWalkthrough = () => {
    setIsActive(false);
  };

  return {
    isActive,
    startWalkthrough,
    completeWalkthrough,
    skipWalkthrough
  };
}