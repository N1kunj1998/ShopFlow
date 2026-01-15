'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from './ProductCard'
import Button from '@/components/ui/Button'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number | null
  images: string[]
  category: {
    id: string
    name: string
    slug: string
  }
}

export default function ProductList() {
  const params = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        
        if (params.get('page')) queryParams.set('page', params.get('page')!)
        if (params.get('category')) queryParams.set('category', params.get('category')!)
        if (params.get('search')) queryParams.set('search', params.get('search')!)
        if (params.get('minPrice')) queryParams.set('minPrice', params.get('minPrice')!)
        if (params.get('maxPrice')) queryParams.set('maxPrice', params.get('maxPrice')!)
        if (params.get('sortBy')) queryParams.set('sortBy', params.get('sortBy')!)
        if (params.get('sortOrder')) queryParams.set('sortOrder', params.get('sortOrder')!)

        const response = await fetch(`/api/products?${queryParams.toString()}`)
        const data = await response.json()

        if (response.ok) {
          setProducts(data.products)
          setPagination(data.pagination)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [params])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
        <p className="text-gray-400 mt-2">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => {
              const newParams = new URLSearchParams(params.toString())
              newParams.set('page', String(pagination.page - 1))
              window.location.href = `/products?${newParams.toString()}`
            }}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => {
              const newParams = new URLSearchParams(params.toString())
              newParams.set('page', String(pagination.page + 1))
              window.location.href = `/products?${newParams.toString()}`
            }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

