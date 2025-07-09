'use client';

import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';

export default function GeneratePage() {
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
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            AI Icon Generator
          </h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
            <p className="text-sunset-200 mb-4">
              Welcome, {user?.email}! You're now authenticated and can access the AI Icon Generator.
            </p>
            
            <div className="bg-sunset-gradient rounded-lg p-6 mb-6">
              <h2 className="text-white text-xl font-semibold mb-4">
                Generate Your AI Icon
              </h2>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white text-sm">
                  AI Icon generation feature coming soon!
                </p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Link 
                href="/library" 
                className="bg-coral-gradient text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300"
              >
                View Library
              </Link>
              <Link 
                href="/account" 
                className="bg-midnight-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-midnight-700 transition-all duration-300"
              >
                Account Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 