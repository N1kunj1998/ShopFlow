'use client'

import { useState } from 'react'
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

  const handleAddToCart = () => {
    // TODO: Implement add to cart in Phase 3
    alert('Add to cart functionality coming in Phase 3!')
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <div className="relative h-96 w-full bg-gray-100 rounded-lg mb-4">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
              onError={handleImageError}
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`relative h-20 w-full rounded border-2 ${
                    selectedImage === image ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover rounded"
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-4">SKU: {product.sku}</p>

          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-3xl font-bold text-gray-900">
                ${parseFloat(product.price.toString()).toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${parseFloat(product.compareAtPrice!.toString()).toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                    {Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 border border-gray-300 rounded"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-3 py-2 border border-gray-300 rounded text-center"
                min="1"
                max={product.stock}
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 border border-gray-300 rounded"
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
              className="flex-1"
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button variant="outline">Add to Wishlist</Button>
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

