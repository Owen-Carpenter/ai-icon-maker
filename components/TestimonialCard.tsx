interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  avatar: string;
  avatarBg: string;
}

export default function TestimonialCard({ quote, name, title, avatar, avatarBg }: TestimonialCardProps) {
  return (
    <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-4 sm:p-6 border border-white/10 hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 w-[220px] sm:w-[260px] lg:w-[320px]">
      <p className="text-sunset-200 mb-6">
        "{quote}"
      </p>
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 ${avatarBg} rounded-full flex items-center justify-center text-white font-bold`}>
          {avatar}
        </div>
        <div>
          <p className="text-white font-semibold">{name}</p>
          <p className="text-sunset-300 text-sm">{title}</p>
        </div>
      </div>
    </div>
  );
} 