import Logo from './Logo';

interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({ text = 'Loading...', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <div className="min-h-screen w-full bg-dark-gradient flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated Site Icon */}
        <div className={`${sizeClasses[size]} flex items-center justify-center shadow-lg animate-pulse`}>
          <Logo 
            width={size === 'sm' ? 28 : size === 'md' ? 42 : 56} 
            height={size === 'sm' ? 28 : size === 'md' ? 42 : 56} 
            className="animate-spin" 
          />
        </div>
        
        {/* Site Name */}
        <div className="text-center">
          <h2 className={`${textSizeClasses[size]} font-semibold text-white mb-2`}>
            AI Icon Maker
          </h2>
          <p className={`${size === 'sm' ? 'text-xs' : 'text-sm'} text-sunset-200 animate-pulse`}>
            {text}
          </p>
        </div>

        {/* Loading Dots Animation */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-sunset-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-2 h-2 bg-sunset-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 bg-sunset-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    </div>
  );
} 