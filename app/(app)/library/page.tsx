'use client';

import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';

interface SavedIcon {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
  tags: string[];
  category: string;
  format: 'PNG' | 'SVG' | 'ICO';
}

export default function LibraryPage() {
  const { user, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data - in real app, this would come from your database
  const [savedIcons] = useState<SavedIcon[]>([
    {
      id: '1',
      name: 'Lightning Bolt',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2QzAwIi8+Cjwvc3ZnPgo=',
      createdAt: '2024-01-15',
      tags: ['energy', 'power', 'electric'],
      category: 'business',
      format: 'SVG'
    },
    {
      id: '2',
      name: 'Heart Icon',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwLjg0IDQuNjFhNS41IDUuNSAwIDAgMC03Ljc4IDBMMTIgNS42N2wtMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAtNy43OCA3Ljc4bDEuMDYgMS4wNkwxMiAyMWw3Ljc4LTcuNzggMS4wNi0xLjA2YTUuNSA1LjUgMCAwIDAtNy43OC03Ljc4eiIgZmlsbD0iI0ZGNkM2QyIvPgo8L3N2Zz4K',
      createdAt: '2024-01-14',
      tags: ['love', 'like', 'favorite'],
      category: 'social',
      format: 'PNG'
    },
    {
      id: '3',
      name: 'Settings Gear',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiM2QzZDRkYiLz4KPC9zdmc+Cg==',
      createdAt: '2024-01-13',
      tags: ['settings', 'config', 'gear'],
      category: 'interface',
      format: 'ICO'
    },
    {
      id: '4',
      name: 'Star Rating',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJsMy4wOSA2LjI2TDIyIDlsLTUgNC44N0wxOC4xOCAyMkwxMiAxOC4yN0w1LjgyIDIyTDcgMTMuODdMMiA5bDYuOTEtLjc0TDEyIDJ6IiBmaWxsPSIjRkZEODAwIi8+Cjwvc3ZnPgo=',
      createdAt: '2024-01-12',
      tags: ['rating', 'star', 'review'],
      category: 'social',
      format: 'SVG'
    },
    {
      id: '5',
      name: 'Shopping Cart',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iIzAwQ0M4OCIvPgo8L3N2Zz4K',
      createdAt: '2024-01-11',
      tags: ['cart', 'shopping', 'ecommerce'],
      category: 'business',
      format: 'PNG'
    },
    {
      id: '6',
      name: 'User Profile',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiM4QjVDRjYiLz4KPC9zdmc+Cg==',
      createdAt: '2024-01-10',
      tags: ['user', 'profile', 'person'],
      category: 'interface',
      format: 'SVG'
    }
  ]);

  const categories = ['all', 'business', 'social', 'interface', 'design'];
  const formats = ['all', 'PNG', 'SVG', 'ICO'];

  const filteredIcons = savedIcons.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         icon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
    const matchesFormat = selectedFormat === 'all' || icon.format === selectedFormat;
    
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const handleDownload = (icon: SavedIcon) => {
    // In a real app, this would download the actual file
    console.log('Downloading:', icon.name);
  };

  const handleDelete = (iconId: string) => {
    // In a real app, this would delete from database
    console.log('Deleting icon:', iconId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navbar variant="app" />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Your Icon Library</h1>
          <p className="text-sunset-200">Manage and organize your saved icons</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sunset-200 text-sm">Total Icons</p>
                <p className="text-white text-2xl font-bold">{savedIcons.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#ff7e5f] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sunset-200 text-sm">This Month</p>
                <p className="text-white text-2xl font-bold">3</p>
              </div>
              <div className="w-12 h-12 bg-[#ff7e5f] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sunset-200 text-sm">Categories</p>
                <p className="text-white text-2xl font-bold">4</p>
              </div>
              <div className="w-12 h-12 bg-[#ff7e5f] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sunset-200 text-sm">Storage Used</p>
                <p className="text-white text-2xl font-bold">2.4MB</p>
              </div>
              <div className="w-12 h-12 bg-[#ff7e5f] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search icons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-midnight-900 text-white">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
              >
                {formats.map(format => (
                  <option key={format} value={format} className="bg-midnight-900 text-white">
                    {format === 'all' ? 'All Formats' : format}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-white/10 rounded-lg border border-white/20">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-lg transition-colors ${viewMode === 'grid' ? 'bg-sunset-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-lg transition-colors ${viewMode === 'list' ? 'bg-sunset-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Icons Grid/List */}
        {filteredIcons.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' : 'space-y-4'}>
            {filteredIcons.map((icon) => (
              <div key={icon.id} className={`bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg border border-white/10 hover:shadow-xl hover:shadow-sunset-500/20 transition-all duration-300 hover:scale-105 group ${viewMode === 'list' ? 'flex items-center p-4' : 'p-6'}`}>
                {viewMode === 'grid' ? (
                  <>
                    <div className="bg-white/10 rounded-lg p-4 mb-4 flex items-center justify-center h-24">
                      <img src={icon.imageUrl} alt={icon.name} className="w-12 h-12" />
                    </div>
                    <h3 className="text-white font-semibold mb-2 truncate">{icon.name}</h3>
                    <div className="flex items-center justify-between text-xs text-sunset-200 mb-3">
                      <span className="bg-white/10 px-2 py-1 rounded">{icon.format}</span>
                      <span>{icon.createdAt}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(icon)}
                        className="flex-1 bg-sunset-500 hover:bg-sunset-600 text-white text-xs py-2 px-3 rounded transition-colors"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(icon.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs py-2 px-3 rounded transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white/10 rounded-lg p-3 mr-4 flex items-center justify-center">
                      <img src={icon.imageUrl} alt={icon.name} className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{icon.name}</h3>
                      <div className="flex items-center gap-4 text-xs text-sunset-200 mt-1">
                        <span className="bg-white/10 px-2 py-1 rounded">{icon.format}</span>
                        <span>{icon.category}</span>
                        <span>{icon.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(icon)}
                        className="bg-sunset-500 hover:bg-sunset-600 text-white text-xs py-2 px-3 rounded transition-colors"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(icon.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs py-2 px-3 rounded transition-colors"
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
            <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-12 border border-white/10 max-w-md mx-auto">
              <svg className="w-16 h-16 text-sunset-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-white text-xl font-semibold mb-2">No icons found</h3>
              <p className="text-sunset-200 mb-6">
                {searchTerm || selectedCategory !== 'all' || selectedFormat !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start creating icons to build your library'
                }
              </p>
              <Link 
                href="/generate" 
                className="bg-gradient-to-r from-sunset-500 to-coral-500 text-white px-6 py-3 rounded-full font-semibold hover:from-sunset-600 hover:to-coral-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Create Your First Icon
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 