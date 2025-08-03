'use client';

import { useState } from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export default function Logo({ 
  className = '', 
  width = 24, 
  height = 24, 
  alt = 'AI Icon Maker Logo' 
}: LogoProps) {
  const [imageError, setImageError] = useState(false);
  
  // Check if the className contains text-white to apply filter
  const isWhite = className.includes('text-white');
  
  // If image failed to load, show SVG fallback
  if (imageError) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Brain outline */}
        <path
          d="M9 3a4 4 0 0 1 6 0v2a4 4 0 0 1-6 0V3zM7 7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7z"
          stroke={isWhite ? "white" : "currentColor"}
          strokeWidth="1.5"
          fill="none"
        />
        {/* Brain folds */}
        <path
          d="M9 9h6M9 11h6M9 13h6M9 15h6"
          stroke={isWhite ? "white" : "currentColor"}
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Pencil */}
        <path
          d="M6 6l12 12M7 5l10 10"
          stroke={isWhite ? "white" : "currentColor"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  
  // Use regular img tag directly for better production compatibility
  return (
    <img
      src="/images/AIIconMakerLogo.png"
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${isWhite ? 'brightness-0 invert' : ''}`}
      style={isWhite ? { filter: 'brightness(0) invert(1)' } : {}}
      onError={(e) => {
        console.error('Logo failed to load:', e);
        setImageError(true);
      }}
      onLoad={() => {
        console.log('Logo loaded successfully');
      }}
    />
  );
} 