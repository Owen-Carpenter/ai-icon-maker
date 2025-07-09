'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-center">
          {/* Centered Navigation Container */}
          <div className="flex items-center bg-white/75 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 px-6 py-3">
            {/* Logo */}
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
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-3 py-2 rounded-full hover:bg-gray-100">
                Home
              </Link>
              <Link href="/generate" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-3 py-2 rounded-full hover:bg-gray-100">
                Generate
              </Link>
              <Link href="/library" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-3 py-2 rounded-full hover:bg-gray-100">
                Library
              </Link>
              <Link href="/account" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-3 py-2 rounded-full hover:bg-gray-100">
                Account
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-3 py-2 rounded-full hover:bg-gray-100">
                Contact
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4 ml-8">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-4 py-2 rounded-full hover:bg-gray-100">
                Login
              </Link>
              <Link 
                href="/generate" 
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Sign up
              </Link>
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
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-4 py-3 rounded-full hover:bg-gray-100">
                  Home
                </Link>
                <Link href="/generate" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-4 py-3 rounded-full hover:bg-gray-100">
                  Generate
                </Link>
                <Link href="/library" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-4 py-3 rounded-full hover:bg-gray-100">
                  Library
                </Link>
                <Link href="/account" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-4 py-3 rounded-full hover:bg-gray-100">
                  Account
                </Link>
                <Link href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-4 py-3 rounded-full hover:bg-gray-100">
                  Contact
                </Link>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex flex-col space-y-3">
                    <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium px-4 py-3 rounded-full hover:bg-gray-100 text-center">
                      Login
                    </Link>
                    <Link 
                      href="/generate" 
                      className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                    >
                      Sign up
                    </Link>
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