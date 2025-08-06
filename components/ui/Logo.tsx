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
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ width: width, height: height }}
    >
      🧠
    </div>
  );
} 