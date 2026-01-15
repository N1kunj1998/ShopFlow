'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Button from './ui/Button'
import SearchBar from './SearchBar'

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
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8 flex-1">
            <Link href="/" className="text-xl font-bold text-gray-900">
              E-Commerce
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <div className="flex-1 max-w-lg">
              <SearchBar />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

