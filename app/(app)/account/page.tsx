export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Account Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                  Update Profile
                </button>
              </div>
            </div>
            
            {/* Usage Stats */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Usage Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Icons Created</h3>
                  <p className="text-3xl font-bold text-purple-400">24</p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Downloads</h3>
                  <p className="text-3xl font-bold text-blue-400">18</p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Credits Used</h3>
                  <p className="text-3xl font-bold text-green-400">42</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subscription Info */}
          <div>
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">Subscription</h2>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Free Plan</h3>
                <p className="text-gray-400 mb-4">Basic features included</p>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Monthly Credits</span>
                  <span className="text-purple-400">10/10</span>
                </div>
                <div className="flex justify-between">
                  <span>Downloads</span>
                  <span className="text-purple-400">5/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage</span>
                  <span className="text-purple-400">100MB</span>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                Upgrade to Pro
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
                  Download All Icons
                </button>
                <button className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
                  Export Data
                </button>
                <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 