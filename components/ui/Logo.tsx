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

  if (imageError) {
    // Fallback to text if image fails to load
    return (
      <div 
        className={`${className} bg-[#ff7e5f] rounded-full flex items-center justify-center text-white font-bold text-xs`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        AI
      </div>
    );
  }

  return (
    <img
      src="/AIIconMakerLogo.png"
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ width: `${width}px`, height: `${height}px` }}
      onLoad={() => console.log('Logo loaded successfully')}
      onError={(e) => {
        console.error('Logo failed to load:', e);
        const target = e.target as HTMLImageElement;
        console.error('Attempted src:', target.src);
        console.error('Current origin:', window.location.origin);
        setImageError(true);
      }}
    />
  );
} 