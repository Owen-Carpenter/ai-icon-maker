export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Generate Icons</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Generation Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">AI Generation</h2>
            <p className="text-gray-300 mb-6">
              Describe your icon and let AI create it for you
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Describe your icon
                </label>
                <textarea
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                  rows={4}
                  placeholder="e.g., A modern shopping cart icon with a minimalist design..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Style
                </label>
                <select className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500">
                  <option>Flat Design</option>
                  <option>3D Style</option>
                  <option>Line Art</option>
                  <option>Filled</option>
                </select>
              </div>
              
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                Generate Icon
              </button>
            </div>
          </div>
          
          {/* Drawing Canvas Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Drawing Canvas</h2>
            <p className="text-gray-300 mb-6">
              Create your icon by drawing
            </p>
            
            <div className="bg-white rounded-lg aspect-square mb-4 flex items-center justify-center">
              <p className="text-gray-500">Canvas will be implemented here</p>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Clear Canvas
              </button>
              <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                Save Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 