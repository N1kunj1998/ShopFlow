'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const defaultImage = 'https://via.placeholder.com/400x400?text=No+Image'
  
  // Debug: Log the images array (commented out for production)
  // if (typeof window !== 'undefined') {
  //   console.log('Product:', product.name, 'Images:', product.images, 'Type:', typeof product.images, 'IsArray:', Array.isArray(product.images))
  // }
  
  // Handle images - always an array according to interface
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : defaultImage
  
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl)
  const [imageError, setImageError] = useState(false)
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

  const handleImageError = () => {
    if (typeof window !== 'undefined') {
      console.log('Image failed to load:', currentImageUrl, 'for product:', product.name)
    }
    setImageError(true)
    setCurrentImageUrl(defaultImage)
  }

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
        <div className="relative h-48 w-full bg-gray-100">
          {!imageError ? (
            <img
              src={currentImageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              No Image
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Sale
            </div>
          )}
        </div>
        <div className="p-4">
          {product.category && (
            <p className="text-sm text-gray-500 mb-1">{product.category.name}</p>
          )}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${parseFloat(product.price.toString()).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                ${parseFloat(product.compareAtPrice!.toString()).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

