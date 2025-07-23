

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
    <img
      src="/AIIconMakerLogo.png"
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
} 