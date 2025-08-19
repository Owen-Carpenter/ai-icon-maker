'use client';

import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-16 bg-white/5 backdrop-blur-sm border-r border-white/10 flex flex-col items-center py-6 space-y-6 relative z-[9999]">
      {/* Logo */}
      <div 
        onClick={() => handleNavigation('/')}
        className="w-10 h-10 rounded-lg flex items-center justify-center group relative cursor-pointer hover:bg-white/10 transition-colors"
      >
        <img 
          src="/images/AIIconMakerLogo.png" 
          alt="AI Icon Maker" 
          className="w-8 h-8 object-contain"
        />
        {/* Tooltip */}
        <div className="absolute left-full ml-3 px-3 py-2 bg-midnight-800 border border-white/20 rounded-lg text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
          Go to Homepage
          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-midnight-800"></div>
        </div>
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col space-y-4">
        {/* Generate (Active) */}
        <div className="w-10 h-10 bg-sunset-500/20 border border-sunset-500/30 rounded-lg flex items-center justify-center cursor-pointer group relative">
          <svg className="w-5 h-5 text-sunset-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
                                             {/* Tooltip */}
             <div className="absolute left-full ml-3 px-3 py-2 bg-midnight-800 border border-white/20 rounded-lg text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
               Generate Icons
               <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-midnight-800"></div>
             </div>
        </div>

        {/* Library */}
        <div 
          onClick={() => handleNavigation('/library')}
          className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors group relative"
        >
          <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-3 py-2 bg-midnight-800 border border-white/20 rounded-lg text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
            Icon Library
            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-midnight-800"></div>
          </div>
        </div>

        {/* Community */}
        <div 
          onClick={() => handleNavigation('/community')}
          className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors group relative"
        >
          <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-3 py-2 bg-midnight-800 border border-white/20 rounded-lg text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
            Community
            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-midnight-800"></div>
          </div>
        </div>

        {/* Usage */}
        <div 
          onClick={() => handleNavigation('/usage')}
          className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors group relative"
        >
          <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-3 py-2 bg-midnight-800 border border-white/20 rounded-lg text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
            Usage & Limits
            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-midnight-800"></div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex-1 flex flex-col justify-end space-y-4">
        {/* Account */}
        <div 
          onClick={() => handleNavigation('/account')}
          className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors group relative"
        >
          <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-3 py-2 bg-midnight-800 border border-white/20 rounded-lg text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
            Account & Settings
            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-midnight-800"></div>
          </div>
        </div>
      </div>
    </div>
  );
}