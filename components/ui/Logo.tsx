import Image from 'next/image';
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
  
  // If image failed to load, show text fallback
  if (imageError) {
    return (
      <div 
        className={`flex items-center justify-center font-bold ${className}`}
        style={{ width: width, height: height }}
      >
        <span className="text-lg">AI</span>
      </div>
    );
  }
  
  return (
    <Image
      src="/images/AIIconMakerLogo.png"
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${isWhite ? 'brightness-0 invert' : ''}`}
      priority={true}
      style={isWhite ? { filter: 'brightness(0) invert(1)' } : {}}
      unoptimized={true}
      onError={() => setImageError(true)}
    />
  );
} 