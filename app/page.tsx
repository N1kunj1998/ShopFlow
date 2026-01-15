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
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6">
              <span className="block">Welcome to</span>
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                E-Commerce
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl sm:text-2xl text-blue-100 font-light">
              Discover amazing products at unbeatable prices. Your one-stop shop for all your shopping needs.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/products">
                <Button size="lg" variant="secondary" className="shadow-2xl hover:shadow-glow">
                  🛍️ Shop Now
                </Button>
              </Link>
              <Link href="/products?featured=true">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                  Featured Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* Featured Products */}
      {productsWithNumbers.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked selection of our most popular and trending items
            </p>
            <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productsWithNumbers.map((product, index) => (
              <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/products">
              <Button size="lg" className="shadow-lg">
                View All Products →
              </Button>
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}

