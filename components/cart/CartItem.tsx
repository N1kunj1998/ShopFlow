'use client'

import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'

interface CartItemProps {
  item: {
    id: string
    productId: string
    quantity: number
    product: {
      id: string
      name: string
      slug: string
      price: number
      compareAtPrice?: number | null
      images: string[]
      stock: number
      category: {
        id: string
        name: string
        slug: string
      }
    }
    itemTotal: number
  }
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const imageUrl = item.product.images && item.product.images.length > 0
    ? item.product.images[0]
    : 'https://via.placeholder.com/200x200?text=No+Image'

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    if (newQuantity > item.product.stock) {
      alert(`Only ${item.product.stock} items available`)
      return
    }
    onUpdateQuantity(item.id, newQuantity)
  }

  return (
    <div className="p-6 flex gap-4">
      {/* Product Image */}
      <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={item.product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'https://via.placeholder.com/200x200?text=No+Image'
            }}
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.id}`}>
          <h3 className="font-bold text-lg text-gray-900 hover:text-blue-600 mb-1 transition-colors">
            {item.product.name}
          </h3>
        </Link>
        <p className="text-sm text-blue-600 font-medium mb-3">{item.product.category.name}</p>
        
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl font-extrabold text-gray-900">
            ${item.product.price.toFixed(2)}
          </span>
          {item.product.compareAtPrice && item.product.compareAtPrice > item.product.price && (
            <span className="text-sm text-gray-500 line-through">
              ${item.product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-1">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-lg hover:bg-white hover:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              disabled={item.quantity <= 1}
            >
              −
            </button>
            <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-lg hover:bg-white hover:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              disabled={item.quantity >= item.product.stock}
            >
              +
            </button>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Subtotal</p>
            <span className="text-2xl font-extrabold text-gray-900">
              ${item.itemTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <div className="flex-shrink-0">
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl font-semibold transition-all duration-200 border-2 border-transparent hover:border-red-200"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

