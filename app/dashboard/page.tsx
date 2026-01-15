import { requireAuth } from '@/lib/auth-helpers'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to your Dashboard
          </h1>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium">{user?.email}</p>
            </div>
            {user?.name && (
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-lg font-medium">{user.name}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-lg font-medium capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
          <div className="mt-6">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  )
}

