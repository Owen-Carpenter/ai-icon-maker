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
  return (
    <Image
      src="/AIIconMakerLogo.png"
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
} 