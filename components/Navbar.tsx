'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  variant?: 'marketing' | 'app';
}

export default function Navbar({ variant = 'marketing' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    setIsDropdownOpen(false);
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

  // Define navigation links based on variant
  const getNavigationLinks = () => {
    if (variant === 'marketing') {
      return [
        { href: '#features', label: 'Features' },
        { href: '#contact', label: 'Contact' },
        { href: '#pricing', label: 'Pricing' }
      ];
    } else {
      return [
        { href: '/generate', label: 'Generate' },
        { href: '/library', label: 'Library' },
        { href: '#', label: 'Community', onClick: () => alert('🚧 Community features are still being developed and will be available soon! Stay tuned for updates.') }
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-center">
          {/* Centered Navigation Container */}
          <div className="flex items-center bg-white/75 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 px-6 py-3">
            {/* Logo - Clickable to go home */}
            <Link href="/" className="flex items-center space-x-2 group mr-8">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-800">AI Icon Maker</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigationLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  onClick={(e) => handleLinkClick(link, e)}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-3 py-2 rounded-full hover:bg-gray-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4 ml-8">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-4 py-2 rounded-full hover:bg-gray-100"
                  >
                    <span className="text-sm">{user.email}</span>
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link 
                        href="/account" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Account Settings
                      </Link>
                      <button 
                        onClick={handleSignOut}
                        disabled={loading}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
                      >
                        {loading ? 'Signing out...' : 'Sign out'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-4 py-2 rounded-full hover:bg-gray-100">
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 hover:text-gray-900 transition-colors duration-200 ml-4 p-2 rounded-full hover:bg-gray-100"
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
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 w-full max-w-sm">
              <div className="flex flex-col space-y-3">
                {navigationLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    onClick={(e) => handleLinkClick(link, e)}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-4 py-3 rounded-full hover:bg-gray-100"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex flex-col space-y-3">
                    {user ? (
                      <>
                        <div className="text-gray-600 text-sm px-4 py-3 text-center font-medium">{user.email}</div>
                        <Link 
                          href="/account" 
                          className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-4 py-3 rounded-full hover:bg-gray-100 text-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Account Settings
                        </Link>
                        <button 
                          onClick={handleSignOut}
                          disabled={loading}
                          className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-4 py-3 rounded-full hover:bg-gray-100 text-center disabled:opacity-50"
                        >
                          {loading ? 'Signing out...' : 'Sign out'}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-4 py-3 rounded-full hover:bg-gray-100 text-center">
                          Login
                        </Link>
                        <Link 
                          href="/register" 
                          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-sm hover:shadow-md text-center"
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
  );
} 