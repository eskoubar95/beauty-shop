export default function HomePage() {
  // Note: MedusaJS connection test disabled during build to prevent timeouts
  const isMedusaConnected = false

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Beauty Shop
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our curated collection of premium beauty products and skincare essentials.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg text-lg font-medium">
              Shop Now
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium">
              Learn More
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">System Status</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isMedusaConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">
                  MedusaJS Backend: {isMedusaConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Next.js Frontend: Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Shared Packages: Active</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>✅ Modern React 18 + Next.js 15</li>
              <li>✅ TypeScript + Tailwind CSS</li>
              <li>✅ Shared UI Components</li>
              <li>✅ Clerk Authentication</li>
              <li>✅ MedusaJS Integration</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Development</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Phase:</span> 4/7 (Next.js Storefront)
              </div>
              <div>
                <span className="font-medium">Status:</span> In Progress
              </div>
              <div>
                <span className="font-medium">Monorepo:</span> Active
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Ready to Build Something Beautiful?
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-md">
              View Products
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-md">
              Browse Categories
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-md">
              Check Health
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
