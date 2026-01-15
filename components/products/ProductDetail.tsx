'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import ProductCard from './ProductCard'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice?: number | null
  sku: string
  stock: number
  images: string[]
  category: {
    id: string
    name: string
    slug: string
  }
}

interface RelatedProduct {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
}

interface ProductDetailProps {
  product: Product
  relatedProducts: RelatedProduct[]
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const router = useRouter()
  const defaultImage = 'https://via.placeholder.com/600x600?text=No+Image'
  const initialImage = product.images && product.images.length > 0
      ? product.images[0]
      : defaultImage
  const [selectedImage, setSelectedImage] = useState(initialImage)
  const [imageError, setImageError] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

  const handleImageError = () => {
    setImageError(true)
    setSelectedImage(defaultImage)
  }

  const handleAddToCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      })

      const data = await response.json()

      if (response.status === 401) {
        // User is not authenticated, redirect to login
        const currentUrl = window.location.pathname
        router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`)
        return
      }

      if (!response.ok) {
        alert(data.error || 'Failed to add to cart')
        return
      }

      // Show success message
      alert('Item added to cart!')
      
      // Optionally redirect to cart or refresh cart count
      // You can add cart count update logic here
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add item to cart. Please try again.')
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div>
          <div className="relative h-[500px] w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-6 overflow-hidden shadow-soft group">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              onError={handleImageError}
            />
            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl">
                {Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)}% OFF
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`relative h-24 w-full rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === image 
                      ? 'border-blue-500 ring-4 ring-blue-200 scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://via.placeholder.com/400x400?text=No+Image'
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-3">
              {product.category.name}
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 leading-tight">{product.name}</h1>
            <p className="text-sm text-gray-500 font-medium">SKU: <span className="text-gray-700">{product.sku}</span></p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-gray-100">
            <div className="flex items-baseline space-x-4 mb-3">
              <span className="text-4xl font-extrabold text-gray-900">
                ${parseFloat(product.price.toString()).toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${parseFloat(product.compareAtPrice!.toString()).toFixed(2)}
                  </span>
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Save {Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)}%
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-green-700 font-semibold">
                    In Stock ({product.stock} available)
                  </p>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <p className="text-red-600 font-semibold">Out of Stock</p>
                </>
              )}
            </div>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
                disabled={quantity <= 1}
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-4 py-3 border-2 border-gray-300 rounded-xl text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max={product.stock}
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-12 h-12 flex items-center justify-center border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 shadow-lg"
              size="lg"
            >
              {product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
            </Button>
            <Button variant="outline" size="lg" className="px-6">
              ❤️ Wishlist
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={{
                  ...relatedProduct,
                  category: product.category,
                  compareAtPrice: null,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

