import { requireAuth } from '@/lib/auth-helpers'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back!</p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-8 border-2 border-gray-100">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</p>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-blue-600 font-semibold mb-2">Role</p>
              <p className="text-2xl font-bold text-blue-900 capitalize">{user?.role?.toLowerCase() || 'User'}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
              <p className="text-purple-600 font-semibold mb-2">Account Status</p>
              <p className="text-2xl font-bold text-purple-900">Active</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
              <p className="text-green-600 font-semibold mb-2">Member Since</p>
              <p className="text-lg font-bold text-green-900">2024</p>
            </div>
          </div>
          <div className="mt-8">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  )
}

