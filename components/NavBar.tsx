'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Button from './ui/Button'
import SearchBar from './SearchBar'
import CartIcon from './cart/CartIcon'

export default function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated by checking for session
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(!!data?.user)
      })
      .catch(() => setIsAuthenticated(false))
  }, [])

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center space-x-10 flex-1">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200">
              E-Commerce
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <div className="flex-1 max-w-xl">
              <SearchBar />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <div className="relative group">
                <CartIcon />
              </div>
            )}
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" className="hidden sm:inline-flex">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="hidden sm:inline-flex">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button className="hidden sm:inline-flex">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

