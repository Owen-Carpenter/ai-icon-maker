'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Sidebar from '../../../components/generate/Sidebar';
import Link from 'next/link';
import Loading from '../../../components/ui/Loading';
import SubscriptionGate from '../../../components/SubscriptionGate';
import SmartGenerateLink from '../../../components/SmartGenerateLink';
import Footer from '../../../components/Footer';

interface SavedIcon {
  id: string;
  name: string;
  image_url: string;
  svg_code: string;
  prompt?: string;
  style?: string;
  color?: string;
  created_at: string;
  tags: string[];
  format: 'PNG' | 'SVG' | 'ICO';
  is_favorite: boolean;
}

export default function LibraryPage() {
  const { user, hasActiveSubscription, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedIcons, setSavedIcons] = useState<SavedIcon[]>([]);
  const [isLoadingIcons, setIsLoadingIcons] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedIconCode, setSelectedIconCode] = useState('');

  // Fetch icons from database
  useEffect(() => {
    if (hasActiveSubscription && user) {
      fetchIcons();
    }
  }, [hasActiveSubscription, user, searchTerm, selectedFormat]);

  const fetchIcons = async () => {
    setIsLoadingIcons(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedFormat !== 'all') params.append('format', selectedFormat);
      
      const response = await fetch(`/api/icons?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setSavedIcons(data.icons || []);
      } else {
        throw new Error('Failed to fetch icons');
      }
    } catch (error) {
      console.error('Error fetching icons:', error);
      setError('Failed to load your icons. Please try again.');
      
      // Fallback to mock data for demonstration
      setSavedIcons([
        {
          id: '1',
          name: 'AI Icon Maker Logo',
          image_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2QzAwIi8+Cjwvc3ZnPgo=',
          svg_code: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L13.09 8.26L20 9L13.09 15.74L12 22L10.91 15.74L4 9L10.91 8.26L12 2Z" fill="#FF6C00"/></svg>',
          created_at: '2024-01-15',
          tags: ['logo', 'brand', 'ai'],
          format: 'SVG' as const,
          is_favorite: false
        },
        {
          id: '2',
          name: 'Heart Icon',
          image_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwLjg0IDQuNjFhNS41IDUuNSAwIDAgMC03Ljc4IDBMMTIgNS42N2wtMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAtNy43OCA3Ljc4bDEuMDYgMS4wNkwxMiAyMWw3Ljc4LTcuNzggMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAtNy43OC03Ljc4eiIgZmlsbD0iI0ZGNkM2QyIvPgo8L3N2Zz4K',
          svg_code: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0-7.78-7.78z" fill="#FF6C6C"/></svg>',
          created_at: '2024-01-14',
          tags: ['love', 'like', 'favorite'],
          format: 'PNG' as const,
          is_favorite: true
        }
      ]);
    } finally {
      setIsLoadingIcons(false);
    }
  };

  const formats = ['all', 'PNG', 'SVG', 'ICO'];

  const filteredIcons = savedIcons.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         icon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFormat = selectedFormat === 'all' || icon.format === selectedFormat;
    
    return matchesSearch && matchesFormat;
  });

  const handleDownload = (icon: SavedIcon) => {
    // In a real app, this would download the actual file
    console.log('Downloading:', icon.name);
  };

  const handleDelete = async (iconId: string) => {
    if (!confirm('Are you sure you want to delete this icon? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/icons/${iconId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the icon from the local state
        setSavedIcons(prevIcons => prevIcons.filter(icon => icon.id !== iconId));
      } else {
        throw new Error('Failed to delete icon');
      }
    } catch (error) {
      console.error('Error deleting icon:', error);
      alert('Failed to delete icon. Please try again.');
    }
  };

  const handleShowCode = (icon: SavedIcon) => {
    setSelectedIconCode(icon.svg_code);
    setShowCodeModal(true);
  };

  if (loading) {
    return <Loading text="Loading your icon library..." />;
  }

  // Show subscription gate if user doesn't have active subscription
  if (!hasActiveSubscription) {
    return (
      <SubscriptionGate 
        title="Icon Library"
        description="Access your saved icons and manage your collection. A subscription is required to access the icon library."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-900 flex flex-col">
      <div className="flex flex-1 lg:flex-row relative overflow-hidden">
        <Sidebar currentPage="library" />
        
        <div className="flex-1 relative overflow-hidden lg:ml-16">
          {/* Header */}
          <div className="px-6 sm:px-8 lg:px-12 py-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Your Icon 
              <span className="inline-flex items-center mx-1 sm:mx-2">
                <span className="text-2xl sm:text-3xl lg:text-4xl">📚</span>
              </span>
              <span className="bg-gradient-to-r from-sunset-500 to-coral-500 bg-clip-text text-transparent">Library</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-sunset-200 mb-8 max-w-2xl mx-auto px-4">
              Manage and organize your collection of saved icons
            </p>
          </div>

          {/* Search and Filters */}
          <div className="px-6 sm:px-8 lg:px-12 mb-8">
            <div className="bg-midnight-800/90 border border-midnight-700 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sunset-300/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search your icons..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-midnight-700/50 border border-midnight-600 rounded-xl text-white placeholder-sunset-300/70 focus:outline-none focus:border-sunset-400 focus:ring-2 focus:ring-sunset-400/20 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex gap-3 items-center">
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="px-4 py-3 bg-midnight-700/50 border border-midnight-600 rounded-xl text-white focus:outline-none focus:border-sunset-400 focus:ring-2 focus:ring-sunset-400/20 transition-all duration-300"
                  >
                    {formats.map(format => (
                      <option key={format} value={format} className="bg-midnight-800 text-white">
                        {format === 'all' ? 'All Formats' : format}
                      </option>
                    ))}
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex bg-midnight-700/50 rounded-xl border border-midnight-600">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-3 rounded-l-xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-gradient-to-r from-sunset-500 to-coral-500 text-white' : 'text-sunset-300/70 hover:text-white'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-3 rounded-r-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-gradient-to-r from-sunset-500 to-coral-500 text-white' : 'text-sunset-300/70 hover:text-white'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Icons Grid/List */}
          <div className="px-6 sm:px-8 lg:px-12 pb-8">
            {filteredIcons.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' : 'space-y-4'}>
                {filteredIcons.map((icon) => (
                  <div key={icon.id} className={`bg-midnight-800/50 border border-midnight-700 rounded-xl backdrop-blur-sm hover:shadow-xl hover:shadow-sunset-500/20 transition-all duration-300 hover:scale-105 hover:border-sunset-400/50 group ${viewMode === 'list' ? 'flex items-center p-4' : 'p-6'}`}>
                    {viewMode === 'grid' ? (
                      <>
                        <div className="bg-midnight-700/50 rounded-xl p-4 mb-4 flex items-center justify-center h-24 group-hover:bg-midnight-600/50 transition-colors duration-300">
                          <img src={icon.image_url} alt={icon.name} className="w-12 h-12" />
                        </div>
                        <h3 className="text-white font-semibold mb-2 truncate">{icon.name}</h3>
                        <div className="flex items-center justify-between text-xs text-sunset-200 mb-4">
                          <span className="bg-midnight-700/50 px-3 py-1 rounded-full">{icon.format}</span>
                          <span>{new Date(icon.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(icon)}
                            className="flex-1 bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white text-sm py-2 px-3 rounded-lg transition-all duration-300 font-medium"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => handleShowCode(icon)}
                            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-sm py-2 px-3 rounded-lg transition-all duration-300 flex items-center gap-1"
                            title="View SVG Code"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(icon.id)}
                            className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white text-sm py-2 px-3 rounded-lg transition-all duration-300"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-midnight-700/50 rounded-xl p-3 mr-4 flex items-center justify-center">
                          <img src={icon.image_url} alt={icon.name} className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{icon.name}</h3>
                          <div className="flex items-center gap-4 text-xs text-sunset-200 mt-1">
                            <span className="bg-midnight-700/50 px-3 py-1 rounded-full">{icon.format}</span>
                            <span>{new Date(icon.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(icon)}
                            className="bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white text-sm py-2 px-4 rounded-lg transition-all duration-300 font-medium"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => handleShowCode(icon)}
                            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-sm py-2 px-3 rounded-lg transition-all duration-300 flex items-center gap-1"
                            title="View SVG Code"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            Code
                          </button>
                          <button
                            onClick={() => handleDelete(icon.id)}
                            className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white text-sm py-2 px-3 rounded-lg transition-all duration-300"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-midnight-800/50 border border-midnight-700 rounded-2xl p-12 max-w-md mx-auto backdrop-blur-sm">
                  <div className="w-16 h-16 bg-gradient-to-br from-sunset-500/20 to-coral-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-sunset-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-3">No icons found</h3>
                  <p className="text-sunset-200 mb-8 leading-relaxed">
                    {searchTerm || selectedFormat !== 'all' 
                      ? 'Try adjusting your search or filters to find what you\'re looking for'
                      : 'Start creating icons to build your personal library'
                    }
                  </p>
                  <SmartGenerateLink 
                    className="inline-flex items-center bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <span className="mr-2">🎨</span>
                    Create Your First Icon
                  </SmartGenerateLink>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      <Footer />

      {/* Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-midnight-800 border border-white/20 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <h3 className="text-lg font-semibold text-white">SVG Code</h3>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-midnight-900 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">SVG Code</span>
                <button
                  onClick={() => navigator.clipboard.writeText(selectedIconCode)}
                  className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-1 rounded text-xs font-medium transition-colors border border-purple-500/30"
                >
                  Copy Code
                </button>
              </div>
              <pre className="text-green-400 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                <code>{selectedIconCode}</code>
              </pre>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                Copy this SVG code to use your icon in any web project or design tool.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 