import { testMedusaConnection } from '@/lib/medusa'

export default async function HealthPage() {
  const isMedusaConnected = await testMedusaConnection()
  
  const healthStatus = {
    status: isMedusaConnected ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    services: {
      frontend: {
        status: 'healthy',
        uptime: process.uptime(),
      },
      medusa: {
        status: isMedusaConnected ? 'healthy' : 'unhealthy',
        url: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000',
      },
      shared_packages: {
        status: 'healthy',
        packages: ['@beauty-shop/ui', '@beauty-shop/types', '@beauty-shop/config'],
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            System Health Check
          </h1>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-4 h-4 rounded-full ${
                healthStatus.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <h2 className="text-xl font-semibold">
                Overall Status: {healthStatus.status.toUpperCase()}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Frontend Service</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Status: {healthStatus.services.frontend.status}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Uptime: {Math.floor(healthStatus.services.frontend.uptime)}s
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">MedusaJS Backend</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    healthStatus.services.medusa.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span>Status: {healthStatus.services.medusa.status}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  URL: {healthStatus.services.medusa.url}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Shared Packages</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Status: {healthStatus.services.shared_packages.status}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Packages: {healthStatus.services.shared_packages.packages.join(', ')}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500">
                Last checked: {new Date(healthStatus.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <a 
              href="/" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
