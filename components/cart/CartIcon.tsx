'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CartIcon() {
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch('/api/cart')
        if (response.ok) {
          const data = await response.json()
          setItemCount(data.summary?.itemCount || 0)
        }
      } catch (error) {
        // User might not be logged in, ignore error
      }
    }

    fetchCartCount()
    
    // Refresh cart count periodically
    const interval = setInterval(fetchCartCount, 30000) // Every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  return (
    <Link href="/cart" className="relative group">
      <div className="p-2 rounded-xl hover:bg-blue-50 transition-colors duration-200">
        <svg
          className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-bounce-slow ring-2 ring-white">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  )
}

