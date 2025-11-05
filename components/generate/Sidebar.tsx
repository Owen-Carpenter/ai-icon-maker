'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ConfirmDialog from '../ui/ConfirmDialog';

interface SidebarProps {
  currentPage?: string;
  onStartWalkthrough?: () => void;
  isGenerating?: boolean;
}

export default function Sidebar({ currentPage = 'generate', onStartWalkthrough, isGenerating = false }: SidebarProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string>('');

  const handleNavigation = (path: string) => {
    // Prevent navigation if generating
    if (isGenerating) {
      setPendingNavigation(path);
      setShowConfirmDialog(true);
      return;
    }
    
    router.push(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleConfirmNavigation = () => {
    setShowConfirmDialog(false);
    router.push(pendingNavigation);
    setIsMobileMenuOpen(false);
    setPendingNavigation('');
  };

  const handleCancelNavigation = () => {
    setShowConfirmDialog(false);
    setPendingNavigation('');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-[10000]">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-10 h-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center text-white/90 hover:text-white hover:bg-white/30 transition-all duration-300 shadow-lg shadow-black/10 ring-1 ring-white/20"
        >
          {isMobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[9998]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop always visible, Mobile slide-in */}
      <div 
        data-walkthrough="sidebar"
        className={`
          fixed
          w-64 lg:w-16 
          h-full
          bg-white/20 backdrop-blur-xl
          border-r border-white/30 
          flex flex-col 
          py-6 
          z-[9999]
          transition-transform duration-300 ease-in-out
          shadow-2xl shadow-black/20
          ring-1 ring-white/20
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
                {/* Logo */}
        <div className="lg:flex lg:items-center lg:justify-center mb-6">
          <div 
            onClick={() => handleNavigation('/')}
            className="lg:w-10 lg:h-10 w-full flex items-center lg:justify-center justify-start lg:px-0 px-3 py-2 lg:py-0 cursor-pointer hover:opacity-80 transition-opacity group relative"
          >
            <img 
              src="/images/AIIconMakerLogo.png" 
              alt="AI Icon Maker" 
              className="w-8 h-8 lg:w-10 lg:h-10 object-contain lg:mr-0 mr-3"
            />
            <span className="text-sunset-600 font-semibold lg:hidden drop-shadow-md">AI Icon Maker</span>
            {/* Desktop Tooltip */}
            <div className="hidden lg:block absolute left-full ml-3 px-3 py-2 bg-midnight-800 border border-white/20 rounded-lg text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
              Go to Homepage
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-midnight-800"></div>
            </div>
          </div>
        </div>

        {/* Navigation Icons */}
        <div className="flex flex-col lg:space-y-4 space-y-2 lg:items-center items-stretch lg:px-0 px-4">
          {/* Generate */}
          <div 
            onClick={() => handleNavigation('/generate')}
            className={`lg:w-10 lg:h-10 w-full rounded-2xl flex items-center lg:justify-center justify-start lg:px-0 px-3 py-2 lg:py-0 cursor-pointer group relative border transition-all duration-300 ${
              currentPage === 'generate' 
                ? 'bg-white/30 border-white/40 backdrop-blur-md' 
                : 'bg-white/10 border-white/30 hover:bg-white/20 hover:backdrop-blur-md hover:border-white/40'
            }`}>
            <svg className="w-5 h-5 text-white/90 group-hover:text-white transition-colors lg:mr-0 mr-3 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-white/90 group-hover:text-white font-semibold lg:hidden drop-shadow-sm transition-colors">Generate Icons</span>
            {/* Desktop Tooltip */}
            <div className="hidden lg:block absolute left-full ml-3 px-3 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white/90 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[99999] shadow-lg shadow-black/20 ring-1 ring-white/20">
              Generate Icons
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-white/20"></div>
            </div>
          </div>

          {/* Library */}
          <div 
            onClick={() => handleNavigation('/library')}
            className={`lg:w-10 lg:h-10 w-full rounded-2xl flex items-center lg:justify-center justify-start lg:px-0 px-3 py-2 lg:py-0 cursor-pointer group relative border transition-all duration-300 ${
              currentPage === 'library' 
                ? 'bg-white/30 border-white/40 backdrop-blur-md' 
                : 'bg-white/10 border-white/30 hover:bg-white/20 hover:backdrop-blur-md hover:border-white/40'
            }`}>
            <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors lg:mr-0 mr-3 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-white/80 group-hover:text-white font-medium lg:hidden drop-shadow-sm transition-colors">Icon Library</span>
            {/* Desktop Tooltip */}
            <div className="hidden lg:block absolute left-full ml-3 px-3 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white/90 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[99999] shadow-lg shadow-black/20 ring-1 ring-white/20">
              Icon Library
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-white/20"></div>
            </div>
          </div>

          {/* Usage */}
          <div 
            onClick={() => handleNavigation('/usage')}
            className={`lg:w-10 lg:h-10 w-full rounded-2xl flex items-center lg:justify-center justify-start lg:px-0 px-3 py-2 lg:py-0 cursor-pointer group relative border transition-all duration-300 ${
              currentPage === 'usage' 
                ? 'bg-white/30 border-white/40 backdrop-blur-md' 
                : 'bg-white/10 border-white/30 hover:bg-white/20 hover:backdrop-blur-md hover:border-white/40'
            }`}>
            <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors lg:mr-0 mr-3 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-white/80 group-hover:text-white font-medium lg:hidden drop-shadow-sm transition-colors">Usage & Limits</span>
            {/* Desktop Tooltip */}
            <div className="hidden lg:block absolute left-full ml-3 px-3 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white/90 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[99999] shadow-lg shadow-black/20 ring-1 ring-white/20">
              Usage & Limits
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-white/20"></div>
            </div>
          </div>

          {/* Help */}
                          <div 
                  onClick={() => {
                    if (onStartWalkthrough) {
                      onStartWalkthrough();
                    } else {
                    }
                  }}
            className="lg:w-10 lg:h-10 w-full bg-white/10 rounded-2xl flex items-center lg:justify-center justify-start lg:px-0 px-3 py-2 lg:py-0 cursor-pointer hover:bg-white/20 hover:backdrop-blur-md transition-all duration-300 group relative border border-white/30 hover:border-white/40"
          >
            <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors lg:mr-0 mr-3 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white/80 group-hover:text-white font-medium lg:hidden drop-shadow-sm transition-colors">Help & Tips</span>
            {/* Desktop Tooltip */}
            <div className="hidden lg:block absolute left-full ml-3 px-3 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white/90 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[99999] shadow-lg shadow-black/20 ring-1 ring-white/20">
              Help & Tips
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-white/20"></div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex-1 flex flex-col justify-end lg:space-y-4 space-y-2 lg:items-center items-stretch lg:px-0 px-4">
          {/* Account */}
          <div 
            onClick={() => handleNavigation('/account')}
            className="lg:w-10 lg:h-10 w-full bg-white/10 rounded-2xl flex items-center lg:justify-center justify-start lg:px-0 px-3 py-2 lg:py-0 cursor-pointer hover:bg-white/20 hover:backdrop-blur-md transition-all duration-300 group relative border border-white/30 hover:border-white/40"
          >
            <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors lg:mr-0 mr-3 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-white/80 group-hover:text-white font-medium lg:hidden drop-shadow-sm transition-colors">Account & Settings</span>
            {/* Desktop Tooltip */}
            <div className="hidden lg:block absolute left-full ml-3 px-3 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white/90 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[99999] shadow-lg shadow-black/20 ring-1 ring-white/20">
              Account & Settings
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-white/20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Generation in Progress"
        message="Your icon is still being generated. If you leave now, your progress will be lost. Are you sure you want to continue?"
        confirmText="Leave Anyway"
        cancelText="Stay on Page"
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
        variant="warning"
      />
    </>
  );
}