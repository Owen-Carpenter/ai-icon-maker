'use client';

import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';

export default function AccountPage() {
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">
            Account Settings
          </h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Information */}
              <div className="bg-midnight-900/50 backdrop-blur-sm rounded-lg p-6 border border-midnight-800">
                <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white">
                      {user?.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">User ID</label>
                    <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm font-mono">
                      {user?.id}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Account Created</label>
                    <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-midnight-900/50 backdrop-blur-sm rounded-lg p-6 border border-midnight-800">
                <h2 className="text-xl font-semibold text-white mb-4">Account Actions</h2>
                <div className="space-y-4">
                  <button className="w-full bg-sunset-gradient text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300">
                    Update Profile
                  </button>
                  <button className="w-full bg-coral-gradient text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300">
                    Change Password
                  </button>
                  <button className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="text-center mt-8">
              <div className="flex justify-center space-x-4">
                <Link 
                  href="/generate" 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300"
                >
                  Generate Icons
                </Link>
                <Link 
                  href="/library" 
                  className="bg-midnight-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-midnight-700 transition-all duration-300"
                >
                  View Library
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 