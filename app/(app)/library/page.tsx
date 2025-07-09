'use client';

import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';

export default function LibraryPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-gradient">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">
            Your Icon Library
          </h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
            <p className="text-sunset-200 mb-6 text-center">
              Welcome to your personal icon library, {user?.email}!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder for icons */}
              <div className="bg-midnight-900/50 backdrop-blur-sm rounded-lg p-6 text-center border border-midnight-800">
                <div className="bg-sunset-gradient rounded-lg h-32 flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-white text-sm">No icons yet</p>
                <p className="text-gray-400 text-xs mt-2">Start creating icons to see them here</p>
              </div>
              
              <div className="bg-midnight-900/50 backdrop-blur-sm rounded-lg p-6 text-center border border-midnight-800">
                <div className="bg-coral-gradient rounded-lg h-32 flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-white text-sm">Sample Icon</p>
                <p className="text-gray-400 text-xs mt-2">Demo placeholder</p>
              </div>
              
              <div className="bg-midnight-900/50 backdrop-blur-sm rounded-lg p-6 text-center border border-midnight-800">
                <div className="bg-aurora-gradient rounded-lg h-32 flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-white text-sm">Another Icon</p>
                <p className="text-gray-400 text-xs mt-2">Demo placeholder</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link 
                href="/generate" 
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Create New Icon
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 