'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SmartGenerateLink from './SmartGenerateLink';
import Logo from './ui/Logo';

interface NavbarProps {
  variant?: 'marketing' | 'app';
}

interface NavigationLink {
  href: string;
  label: string;
  isSmartLink?: boolean;
  onClick?: () => void;
}

export default function Navbar({ variant = 'marketing' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const { user, signOut, loading } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSignOut = async () => {
    await signOut();
    setIsDropdownOpen(false);
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovering(false);
    }, 300); // 300ms delay before hiding
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-hide navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when at top, scrolling up, or hovering
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 30) {
        // Scrolling down and past threshold
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [lastScrollY]);

  // Show navbar on hover when hidden
  useEffect(() => {
    if (isHovering) {
      setIsVisible(true);
    }
  }, [isHovering]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Define navigation links based on variant
  const getNavigationLinks = (): NavigationLink[] => {
    if (variant === 'marketing') {
      return [
        { href: '#features', label: 'Features' },
        { href: '/generate', label: 'Generate', isSmartLink: true },
        { href: '#pricing', label: 'Pricing' }
      ];
    } else {
      return [
        { href: '/generate', label: 'Generate' },
        { href: '/library', label: 'Library' },
        { href: '/usage', label: 'Usage' }
      ];
    }
  };

  const navigationLinks = getNavigationLinks();

  const handleLinkClick = (link: any, e: React.MouseEvent) => {
    if (link.onClick) {
      e.preventDefault();
      link.onClick();
    }
  };

  return (
    <>
      {/* Invisible hover area at top when navbar is hidden */}
      {!isVisible && (
        <div 
          className="fixed top-0 left-0 right-0 h-4 z-40"
          onMouseEnter={handleMouseEnter}
        />
      )}
      
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-center">
          {/* Centered Navigation Container */}
          <div className="flex items-center bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 border border-white/30 px-8 py-4 ring-1 ring-white/20">
            {/* Logo - Clickable to go home */}
            <Link href="/" className="flex items-center space-x-2 group mr-8">
              <Logo width={32} height={32} className="group-hover:scale-105 transition-transform duration-200" />
              <span className="text-lg font-semibold text-white/90 drop-shadow-sm">AI Icon Maker</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigationLinks.map((link) => (
                link.isSmartLink ? (
                  <SmartGenerateLink
                    key={link.href}
                    className="text-white/80 hover:text-white transition-all duration-300 font-medium px-4 py-2.5 rounded-2xl hover:bg-white/20 hover:backdrop-blur-md border border-transparent hover:border-white/30"
                    fallbackHref="/register"
                  >
                    {link.label}
                  </SmartGenerateLink>
                ) : (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    onClick={(e) => handleLinkClick(link, e)}
                    className="text-white/80 hover:text-white transition-all duration-300 font-medium px-4 py-2.5 rounded-2xl hover:bg-white/20 hover:backdrop-blur-md border border-transparent hover:border-white/30"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4 ml-8">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300 font-medium px-4 py-2.5 rounded-2xl hover:bg-white/20 hover:backdrop-blur-md border border-transparent hover:border-white/30"
                  >
                    <span className="text-sm">{user.email}</span>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-white/30 py-2 z-50 ring-1 ring-white/20">
                      <Link 
                        href="/account" 
                        className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 mx-2 rounded-xl"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Account Settings
                      </Link>
                      <button 
                        onClick={handleSignOut}
                        disabled={loading}
                        className="w-full text-left px-4 py-3 text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50 mx-2 rounded-xl"
                      >
                        {loading ? 'Signing out...' : 'Sign out'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-white/80 hover:text-white transition-all duration-300 font-medium px-4 py-2.5 rounded-2xl hover:bg-white/20 hover:backdrop-blur-md border border-transparent hover:border-white/30">
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-gradient-to-r from-orange-500/90 to-pink-500/90 backdrop-blur-md text-white px-6 py-2.5 rounded-2xl font-medium hover:from-orange-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 hover:border-white/40"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white/80 hover:text-white transition-all duration-300 ml-4 p-2 rounded-2xl hover:bg-white/20 hover:backdrop-blur-md border border-transparent hover:border-white/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 flex justify-center">
            <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 border border-white/30 p-6 w-full max-w-sm ring-1 ring-white/20">
              <div className="flex flex-col space-y-3">
                {navigationLinks.map((link) => (
                  link.isSmartLink ? (
                    <SmartGenerateLink
                      key={link.href}
                      className="text-white/80 hover:text-white transition-all duration-300 font-medium px-4 py-3 rounded-2xl hover:bg-white/20 hover:backdrop-blur-md border border-transparent hover:border-white/30"
                      fallbackHref="/register"
                    >
                      {link.label}
                    </SmartGenerateLink>
                  ) : (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      onClick={(e) => handleLinkClick(link, e)}
                      className="text-white/80 hover:text-white transition-all duration-300 font-medium px-4 py-3 rounded-2xl hover:bg-white/20 hover:backdrop-blur-md border border-transparent hover:border-white/30"
                    >
                      {link.label}
                    </Link>
                  )
                ))}
                <div className="pt-4 border-t border-white/20">
                  <div className="flex flex-col space-y-3">
                    {user ? (
                      <>
                        <div className="text-white/70 text-sm px-4 py-3 text-center font-medium">{user.email}</div>
                        <Link 
                          href="/account" 
                          className="text-white/80 hover:text-white transition-all duration-300 font-medium px-4 py-3 rounded-2xl hover:bg-white/20 hover:backdrop-blur-md border border-transparent hover:border-white/30 text-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Account Settings
                        </Link>
                        <button 
                          onClick={handleSignOut}
                          disabled={loading}
                          className="text-white/80 hover:text-white transition-all duration-300 font-medium px-4 py-3 rounded-2xl hover:bg-white/20 hover:backdrop-blur-md border border-transparent hover:border-white/30 text-center disabled:opacity-50"
                        >
                          {loading ? 'Signing out...' : 'Sign out'}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="text-white/80 hover:text-white transition-all duration-300 font-medium px-4 py-3 rounded-2xl hover:bg-white/20 hover:backdrop-blur-md border border-transparent hover:border-white/30 text-center">
                          Login
                        </Link>
                        <Link 
                          href="/register" 
                          className="bg-gradient-to-r from-orange-500/90 to-pink-500/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-medium hover:from-orange-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 hover:border-white/40 text-center"
                        >
                          Sign up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
} 