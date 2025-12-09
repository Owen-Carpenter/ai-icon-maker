interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  avatar?: string;
  avatarBg?: string;
  avatarImage?: string;
  companyLogo?: string;
  isCompany?: boolean;
}

export default function TestimonialCard({ quote, name, title, avatar, avatarBg, avatarImage, companyLogo, isCompany }: TestimonialCardProps) {
  return (
    <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-4 sm:p-6 border border-white/10 hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 w-[220px] sm:w-[260px] lg:w-[320px]">
      <p className="text-sunset-200 mb-6 text-sm sm:text-base">
        "{quote}"
      </p>
      <div className="flex items-center space-x-3">
        {isCompany && companyLogo ? (
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-md">
            <img src={companyLogo} alt={name} className="w-full h-full object-contain" />
          </div>
        ) : avatarImage ? (
          <img 
            src={avatarImage} 
            alt={name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
          />
        ) : (
          <div className={`w-10 h-10 ${avatarBg} rounded-full flex items-center justify-center text-white font-bold`}>
            {avatar}
          </div>
        )}
        <div>
          <p className="text-white font-semibold text-sm sm:text-base">{name}</p>
          <p className="text-sunset-300 text-xs sm:text-sm">{title}</p>
        </div>
      </div>
    </div>
  );
} 