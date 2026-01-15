import Link from 'next/link'
import Button from '@/components/ui/Button'
import { db } from '@/lib/db'
import ProductCard from '@/components/products/ProductCard'
import NavBar from '@/components/NavBar'

async function getFeaturedProducts() {
  try {
    const products = await db.product.findMany({
      where: {
        active: true,
        featured: true,
      },
      take: 8,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return products
  } catch (error: any) {
    // Handle case where tables don't exist yet
    if (error?.code === 'P2021' || error?.message?.includes('does not exist')) {
      console.log('Database tables not created yet. Run: npm run db:push')
      return []
    }
    console.error('Error fetching featured products:', error)
    return []
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  // Convert Decimal to number for component compatibility
  const productsWithNumbers = featuredProducts.map((product) => ({
    ...product,
    price: parseFloat(product.price.toString()),
    compareAtPrice: product.compareAtPrice ? parseFloat(product.compareAtPrice.toString()) : null,
  }))

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Welcome to E-Commerce
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Your one-stop shop for all your shopping needs
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <Link href="/products">
                <Button size="lg" variant="secondary">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      {productsWithNumbers.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsWithNumbers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/products">
              <Button>View All Products</Button>
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}

