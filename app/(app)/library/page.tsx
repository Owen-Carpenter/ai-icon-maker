'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Sidebar from '../../../components/generate/Sidebar';
import Link from 'next/link';
import Loading from '../../../components/ui/Loading';
import SubscriptionGate from '../../../components/SubscriptionGate';
import SmartGenerateLink from '../../../components/SmartGenerateLink';
import Footer from '../../../components/Footer';
import { generateFileName, downloadPNGImage } from '../../../lib/download-utils';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedIcons, setSavedIcons] = useState<SavedIcon[]>([]);
  const [isLoadingIcons, setIsLoadingIcons] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [iconToDelete, setIconToDelete] = useState<SavedIcon | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<SavedIcon | null>(null);

  // Fetch icons from database
  useEffect(() => {
    if (hasActiveSubscription && user) {
      fetchIcons();
    }
  }, [hasActiveSubscription, user, searchTerm]);

  const fetchIcons = async () => {
    setIsLoadingIcons(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      
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
          svg_code: '<svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M250 75L268.75 195.83L375 225L268.75 304.17L250 425L231.25 304.17L125 225L231.25 195.83L250 75Z" fill="#FF6C00"/></svg>',
          created_at: '2024-01-15',
          tags: ['logo', 'brand', 'ai'],
          format: 'SVG' as const,
          is_favorite: false
        },
        {
          id: '2',
          name: 'Heart Icon',
          image_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwLjg0IDQuNjFhNS41IDUuNSAwIDAgMC03Ljc4IDBMMTIgNS42N2wtMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAtNy43OCA3Ljc4bDEuMDYgMS4wNkwxMiAyMWw3Ljc4LTcuNzggMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAtNy43OC03Ljc4eiIgZmlsbD0iI0ZGNkM2QyIvPgo8L3N2Zz4K',
          svg_code: '<svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M434.17 96.04a114.58 114.58 0 0 0-162.08 0L250 118.13l-22.09-22.09a114.58 114.58 0 0 0-162.08 162.08l22.09 22.09L250 437.5l162.08-162.08 22.09-22.09a114.58 114.58 0 0 0-162.08-162.08z" fill="#FF6C6C"/></svg>',
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

  const filteredIcons = savedIcons.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         icon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const handleDownload = async (icon: SavedIcon) => {
    try {
      // Always download as PNG from the image URL
      const fileName = generateFileName(icon.name, 'png');
      await downloadPNGImage(icon.image_url, fileName);
    } catch (error) {
      console.error('Error downloading icon:', error);
      alert('Failed to download icon as PNG. Please try again.');
    }
  };

  const openDeleteModal = (icon: SavedIcon) => {
    setIconToDelete(icon);
    setShowDeleteModal(true);
  };

  const openImageModal = (icon: SavedIcon) => {
    setSelectedIcon(icon);
    setShowImageModal(true);
  };

  const handleDelete = async () => {
    if (!iconToDelete) return;

    try {
      const response = await fetch(`/api/icons/${iconToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the icon from the local state
        setSavedIcons(prevIcons => prevIcons.filter(icon => icon.id !== iconToDelete.id));
        setShowDeleteModal(false);
        setIconToDelete(null);
      } else {
        throw new Error('Failed to delete icon');
      }
    } catch (error) {
      console.error('Error deleting icon:', error);
      alert('Failed to delete icon. Please try again.');
    }
  };


  if (loading || isLoadingIcons) {
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
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-900">
      <div className="flex lg:flex-row relative min-h-screen">
        <Sidebar currentPage="library" />
        
        <div className="flex-1 relative lg:ml-16 pb-24">
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

          {/* Search and Controls */}
          <div className="px-6 sm:px-8 lg:px-12 mb-8">
            <div className="bg-gradient-to-r from-midnight-800/95 via-midnight-700/90 to-midnight-800/95 border border-midnight-600/50 rounded-3xl p-8 backdrop-blur-sm shadow-2xl shadow-black/20">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                {/* Search Section */}
                <div className="flex-1 w-full lg:max-w-2xl">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-sunset-500/20 to-coral-500/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-sunset-400/80 group-hover:text-sunset-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search your icon collection..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-midnight-800/80 border border-midnight-500/50 rounded-2xl text-white placeholder-sunset-300/60 focus:outline-none focus:border-sunset-400/60 focus:ring-4 focus:ring-sunset-400/10 transition-all duration-300 text-lg backdrop-blur-sm hover:bg-midnight-800/90"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sunset-300/60 hover:text-sunset-400 transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* View Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sunset-200/80">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-sm font-medium">View:</span>
                  </div>
                  
                  {/* View Mode Toggle */}
                  <div className="flex bg-midnight-800/60 rounded-2xl border border-midnight-500/50 p-1 backdrop-blur-sm">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-3 rounded-xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-gradient-to-r from-sunset-500 to-coral-500 text-white shadow-lg shadow-sunset-500/25' : 'text-sunset-300/70 hover:text-sunset-200 hover:bg-midnight-700/50'}`}
                      title="Grid View"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-3 rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-gradient-to-r from-sunset-500 to-coral-500 text-white shadow-lg shadow-sunset-500/25' : 'text-sunset-300/70 hover:text-sunset-200 hover:bg-midnight-700/50'}`}
                      title="List View"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Stats Bar */}
              <div className="mt-6 pt-6 border-t border-midnight-600/30">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sunset-200/80">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="font-medium">{filteredIcons.length} {filteredIcons.length === 1 ? 'Icon' : 'Icons'}</span>
                    </div>
                    {searchTerm && (
                      <div className="flex items-center gap-2 text-sunset-400/80">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="font-medium">Filtered by "{searchTerm}"</span>
                      </div>
                    )}
                  </div>
                  <div className="text-sunset-300/60 text-xs">
                    All icons are PNG format
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Icons Grid/List */}
          <div className="px-6 sm:px-8 lg:px-12 pb-32">
            {filteredIcons.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' : 'space-y-4'}>
                {filteredIcons.map((icon) => (
                  <div key={icon.id} className={`bg-midnight-800/50 border border-midnight-700 rounded-xl backdrop-blur-sm hover:shadow-xl hover:shadow-sunset-500/20 transition-all duration-300 hover:scale-105 hover:border-sunset-400/50 ${viewMode === 'list' ? 'flex items-center p-4' : 'p-6 flex flex-col'}`}>
                    {viewMode === 'grid' ? (
                      <>
                        <div 
                          className="bg-midnight-700/50 rounded-xl p-4 mb-4 flex items-center justify-center h-24 hover:bg-midnight-600/50 transition-colors duration-300 cursor-pointer group"
                          onClick={() => openImageModal(icon)}
                        >
                          <img src={icon.image_url} alt={icon.name} className="w-12 h-12 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <h3 className="text-white font-semibold mb-2 truncate">{icon.name}</h3>
                        <div className="flex items-center justify-end text-xs text-sunset-200 mb-4">
                          <span>{new Date(icon.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-1 mt-auto">
                          <button
                            onClick={() => handleDownload(icon)}
                            className="flex-1 bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white text-xs py-1.5 px-2 rounded-md transition-all duration-300 font-medium flex items-center justify-center gap-1 min-w-0 sm:py-2 sm:px-3 sm:rounded-lg"
                          >
                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="truncate hidden sm:inline">Download PNG</span>
                            <span className="truncate sm:hidden">PNG</span>
                          </button>
                          <button
                            onClick={() => openDeleteModal(icon)}
                            className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white text-xs py-1.5 px-2 rounded-md transition-all duration-300 flex items-center justify-center flex-shrink-0 sm:py-2 sm:px-3 sm:rounded-lg"
                            title="Delete Icon"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div 
                          className="bg-midnight-700/50 rounded-xl p-3 mr-4 flex items-center justify-center cursor-pointer group hover:bg-midnight-600/50 transition-colors duration-300"
                          onClick={() => openImageModal(icon)}
                        >
                          <img src={icon.image_url} alt={icon.name} className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{icon.name}</h3>
                          <div className="flex items-center gap-4 text-xs text-sunset-200 mt-1">
                            <span>{new Date(icon.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDownload(icon)}
                            className="bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white text-xs py-1.5 px-2 rounded-md transition-all duration-300 font-medium flex items-center gap-1 sm:text-sm sm:py-2 sm:px-4 sm:rounded-lg"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="hidden sm:inline">Download PNG</span>
                            <span className="sm:hidden">PNG</span>
                          </button>
                          <button
                            onClick={() => openDeleteModal(icon)}
                            className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white text-xs py-1.5 px-2 rounded-md transition-all duration-300 flex items-center justify-center sm:text-sm sm:py-2 sm:px-3 sm:rounded-lg"
                            title="Delete Icon"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    {searchTerm 
                      ? 'Try adjusting your search to find what you\'re looking for'
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
      
      {/* Footer positioned at bottom */}
      <Footer />


      {/* Image Preview Modal */}
      {showImageModal && selectedIcon && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowImageModal(false);
            setSelectedIcon(null);
          }}
        >
          <div 
            className="bg-gradient-to-br from-midnight-800 to-midnight-900 rounded-2xl border border-white/20 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-sunset-500/20 to-coral-500/20 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-sunset-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedIcon.name}</h3>
                  <p className="text-sunset-200 text-sm">Created {new Date(selectedIcon.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setSelectedIcon(null);
                }}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-midnight-700/50 rounded-xl p-8 mb-6 flex items-center justify-center min-h-[300px]">
              <img 
                src={selectedIcon.image_url} 
                alt={selectedIcon.name} 
                className="max-w-full max-h-[400px] object-contain"
              />
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleDownload(selectedIcon)}
                className="bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PNG
              </button>
              <button
                onClick={() => openDeleteModal(selectedIcon)}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && iconToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-midnight-800 to-midnight-900 rounded-2xl border border-white/20 p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Delete Icon</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-semibold text-white">"{iconToDelete.name}"</span>? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setIconToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 