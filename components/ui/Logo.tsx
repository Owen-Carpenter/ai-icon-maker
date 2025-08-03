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
        {/* Simple brain icon */}
        <circle cx="12" cy="12" r="8" stroke={isWhite ? "white" : "currentColor"} strokeWidth="2" fill="none"/>
        <path d="M8 10h8M8 12h8M8 14h8" stroke={isWhite ? "white" : "currentColor"} strokeWidth="1.5" strokeLinecap="round"/>
        {/* Pencil crossing */}
        <path d="M6 6l12 12" stroke={isWhite ? "white" : "currentColor"} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }
  
  // Try multiple image paths for better production compatibility
  return (
    <img
      src="/AIIconMakerLogo.png"
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