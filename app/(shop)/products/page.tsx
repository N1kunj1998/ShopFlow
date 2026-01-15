import { Suspense } from 'react'
import ProductList from '@/components/products/ProductList'
import ProductFilters from '@/components/products/ProductFilters'
import NavBar from '@/components/NavBar'
import { db } from '@/lib/db'

async function getCategories() {
  try {
    const categories = await db.category.findMany({
      where: { parentId: null },
      include: {
        children: true,
      },
    })
    return categories
  } catch (error: any) {
    // Handle case where tables don't exist yet
    if (error?.code === 'P2021' || error?.message?.includes('does not exist')) {
      console.log('Database tables not created yet. Run: npm run db:push')
      return []
    }
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3">Products</h1>
          <p className="text-lg text-gray-600">Discover our amazing collection</p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
        </div>
        
        {categories.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-semibold mb-2">
              Database tables not created yet
            </p>
            <p className="text-yellow-700 text-sm mb-4">
              Please run the following command to create the database tables:
            </p>
            <code className="bg-yellow-100 px-4 py-2 rounded text-sm block w-fit mx-auto">
              npm run db:push
            </code>
            <p className="text-yellow-700 text-sm mt-4">
              After creating the tables, you can optionally seed sample data with:
            </p>
            <code className="bg-yellow-100 px-4 py-2 rounded text-sm block w-fit mx-auto">
              npm run db:seed
            </code>
          </div>
        ) : (
          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside className="w-64 flex-shrink-0">
              <Suspense fallback={<div>Loading filters...</div>}>
                <ProductFilters categories={categories} />
              </Suspense>
            </aside>

            {/* Product List */}
            <main className="flex-1">
              <Suspense fallback={<div>Loading products...</div>}>
                <ProductList />
              </Suspense>
            </main>
          </div>
        )}
      </div>
    </div>
  )
}

