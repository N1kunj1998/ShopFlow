'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import CartItem from './CartItem'

interface CartItem {
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

interface CartSummary {
  subtotal: number
  tax: number
  total: number
  itemCount: number
}

export default function CartPageClient() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [summary, setSummary] = useState<CartSummary | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCart = useCallback(async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.status === 401) {
        // User not authenticated, redirect to login
        router.push('/login?callbackUrl=/cart')
        return
      }
      if (response.ok) {
        const data = await response.json()
        setCartItems(data.cartItems || data.items)
        setSummary(data.summary)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      })

      if (response.ok) {
        fetchCart() // Refresh cart
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to update quantity')
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      alert('Failed to update quantity')
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    if (!confirm('Remove this item from cart?')) return

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCart() // Refresh cart
      } else {
        alert('Failed to remove item')
      }
    } catch (error) {
      console.error('Error removing item:', error)
      alert('Failed to remove item')
    }
  }

  const handleClearCart = async () => {
    if (!confirm('Clear entire cart?')) return

    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCart() // Refresh cart
      } else {
        alert('Failed to clear cart')
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      alert('Failed to clear cart')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="bg-white rounded-2xl shadow-soft p-16 text-center border-2 border-gray-100">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-600 text-xl mb-2 font-semibold">Your cart is empty</p>
            <p className="text-gray-500 mb-8">Start adding items to your cart!</p>
            <Link href="/products">
              <Button size="lg" className="shadow-lg">
                Continue Shopping →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">{summary?.itemCount || 0} items in your cart</p>
          </div>
          <Button variant="outline" onClick={handleClearCart} className="shadow-md">
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden border-2 border-gray-100">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          {summary && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border-2 border-gray-100">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Subtotal ({summary.itemCount} items)</span>
                    <span className="font-bold">${summary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Tax</span>
                    <span className="font-bold">${summary.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-4 flex justify-between">
                    <span className="text-xl font-extrabold text-gray-900">Total</span>
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ${summary.total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Link href="/checkout" className="block">
                  <Button className="w-full shadow-lg" size="lg">
                    Proceed to Checkout →
                  </Button>
                </Link>
                <Link href="/products" className="block mt-4">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

