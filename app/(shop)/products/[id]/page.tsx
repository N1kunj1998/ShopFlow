import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import ProductDetail from '@/components/products/ProductDetail'
import NavBar from '@/components/NavBar'
import Link from 'next/link'
import Button from '@/components/ui/Button'

async function getProduct(id: string) {
  const product = await db.product.findUnique({
    where: {
      id,
      active: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  })

  if (!product) return null

  // Get related products
  const relatedProducts = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      active: true,
    },
    take: 4,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      images: true,
    },
  })

  return { product, relatedProducts }
}

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const data = await getProduct(params.id)

  if (!data) {
    notFound()
  }

  const { product, relatedProducts } = data

  // Convert Decimal to number for component compatibility
  const productWithNumbers = {
    ...product,
    price: parseFloat(product.price.toString()),
    compareAtPrice: product.compareAtPrice ? parseFloat(product.compareAtPrice.toString()) : null,
  }

  const relatedProductsWithNumbers = relatedProducts.map((p) => ({
    ...p,
    price: parseFloat(p.price.toString()),
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center space-x-2 text-sm">
          <Link 
            href="/" 
            className="text-gray-500 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </Link>
          <span className="text-gray-400">/</span>
          <Link 
            href="/products" 
            className="text-gray-500 hover:text-blue-600 font-medium transition-colors"
          >
            Products
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            href={`/products?category=${product.categoryId}`}
            className="text-gray-500 hover:text-blue-600 font-medium transition-colors"
          >
            {product.category.name}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        <ProductDetail product={productWithNumbers} relatedProducts={relatedProductsWithNumbers} />
      </div>
    </div>
  )
}

