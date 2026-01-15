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
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
        <div className="relative h-64 w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {!imageError ? (
            <img
              src={currentImageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
              SALE
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-5">
          {product.category && (
            <p className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">{product.category.name}</p>
          )}
          <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                ${parseFloat(product.price.toString()).toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  ${parseFloat(product.compareAtPrice!.toString()).toFixed(2)}
                </span>
              )}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

