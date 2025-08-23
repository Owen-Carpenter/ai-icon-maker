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
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300">
        {/* Highlight cutout for target element */}
        {targetElement && (
          <div
            className="absolute border-4 border-sunset-400 rounded-lg shadow-lg shadow-sunset-400/50 animate-pulse"
            style={{
              left: targetElement.getBoundingClientRect().left - 8,
              top: targetElement.getBoundingClientRect().top - 8,
              width: targetElement.getBoundingClientRect().width + 16,
              height: targetElement.getBoundingClientRect().height + 16,
              background: 'transparent',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[9999] bg-white rounded-xl shadow-2xl border border-gray-200 p-6 max-w-sm animate-fade-in"
        style={{
          left: tooltipPosition.x,
          top: tooltipPosition.y,
          transform: 'translateZ(0)' // Force hardware acceleration
        }}
      >
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-sunset-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button
            onClick={skipWalkthrough}
            className="text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors"
          >
            Skip tour
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {step.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {step.content}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-3">
            {/* Progress dots */}
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-sunset-500'
                      : index < currentStep
                      ? 'bg-sunset-300'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextStep}
              className="bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {isLastStep ? 'Finish' : step.nextButton || 'Next'}
            </button>
          </div>
        </div>

        {/* Pointer arrow */}
        {step.position !== 'center' && (
          <div
            className={`absolute w-3 h-3 bg-white border-gray-200 transform rotate-45 ${
              step.position === 'top'
                ? 'bottom-[-6px] left-1/2 -translate-x-1/2 border-b border-r'
                : step.position === 'bottom'
                ? 'top-[-6px] left-1/2 -translate-x-1/2 border-t border-l'
                : step.position === 'left'
                ? 'right-[-6px] top-1/2 -translate-y-1/2 border-t border-r'
                : step.position === 'right'
                ? 'left-[-6px] top-1/2 -translate-y-1/2 border-b border-l'
                : ''
            }`}
          />
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