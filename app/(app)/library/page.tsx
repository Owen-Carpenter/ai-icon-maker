export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Icon Library</h1>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
            Create New Icon
          </button>
        </div>
        
        {/* Filter and Search */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="Search your icons..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Style</label>
              <select className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500">
                <option>All Styles</option>
                <option>Flat Design</option>
                <option>3D Style</option>
                <option>Line Art</option>
                <option>Filled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sort by</label>
              <select className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500">
                <option>Recent</option>
                <option>Name</option>
                <option>Size</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Icons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {/* Placeholder icons */}
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="bg-white rounded-lg aspect-square mb-3 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium truncate">Icon {i + 1}</h3>
              <p className="text-xs text-gray-400">Created today</p>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {false && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No icons yet</h3>
            <p className="text-gray-400 mb-4">Start creating your first icon to see it here</p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
              Create First Icon
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 