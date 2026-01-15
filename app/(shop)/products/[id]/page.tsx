import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import ProductDetail from '@/components/products/ProductDetail'
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-700">
              Products
            </Link>
            <span>/</span>
            <Link
              href={`/products?category=${product.categoryId}`}
              className="hover:text-gray-700"
            >
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </nav>

        <ProductDetail product={productWithNumbers} relatedProducts={relatedProductsWithNumbers} />
      </div>
    </div>
  )
}

