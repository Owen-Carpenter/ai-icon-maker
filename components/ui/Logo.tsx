'use client';

import Image from 'next/image';

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
  // Check if the className contains text-white to apply filter
  const isWhite = className.includes('text-white');
  
  return (
    <Image
      src="/images/AIIconMakerLogo.png"
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${isWhite ? 'brightness-0 invert' : ''}`}
      priority={true}
      style={isWhite ? { filter: 'brightness(0) invert(1)' } : {}}
      //Logo test fix
      //unoptimized={true}
    />
  );
} 