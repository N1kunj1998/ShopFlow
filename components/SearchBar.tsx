'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from './ui/Input'

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search with 300ms delay for better responsiveness
  useEffect(() => {
    if (query.length >= 2) {
      const timer = setTimeout(async () => {
        try {
          const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}&limit=8`)
          const data = await response.json()
          setSuggestions(data.products || [])
          setShowSuggestions(true)
          setSelectedIndex(-1)
        } catch (error) {
          console.error('Search error:', error)
          setSuggestions([])
        }
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }, [query])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`)
      setShowSuggestions(false)
      setQuery('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          router.push(`/products/${suggestions[selectedIndex].id}`)
          setShowSuggestions(false)
          setQuery('')
        } else if (query.trim()) {
          handleSubmit(e)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleSuggestionClick = (productId: string) => {
    router.push(`/products/${productId}`)
    setShowSuggestions(false)
    setQuery('')
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.length >= 2 && suggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setShowSuggestions(false)
              setSelectedIndex(-1)
              inputRef.current?.focus()
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto animate-slide-up">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              {suggestions.length} {suggestions.length === 1 ? 'result' : 'results'} found
            </p>
          </div>
          {suggestions.map((product, index) => (
            <div
              key={product.id}
              onClick={() => handleSuggestionClick(product.id)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`block px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 group ${
                selectedIndex === index
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 ring-2 ring-blue-200'
                  : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                {product.images && product.images.length > 0 ? (
                  <div className={`relative w-14 h-14 rounded-lg overflow-hidden ring-2 transition-all ${
                    selectedIndex === index ? 'ring-blue-300' : 'ring-gray-200 group-hover:ring-blue-300'
                  }`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://via.placeholder.com/56x56?text=No+Image'
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate transition-colors ${
                    selectedIndex === index ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'
                  }`}>
                    {product.name}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-sm font-bold text-blue-600">
                      ${parseFloat(product.price.toString()).toFixed(2)}
                    </p>
                    {product.compareAtPrice && parseFloat(product.compareAtPrice.toString()) > parseFloat(product.price.toString()) && (
                      <p className="text-xs text-gray-500 line-through">
                        ${parseFloat(product.compareAtPrice.toString()).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
                <svg 
                  className={`w-5 h-5 transition-opacity ${
                    selectedIndex === index ? 'opacity-100 text-blue-600' : 'opacity-0 group-hover:opacity-100 text-gray-400'
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
          {query.trim() && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                className="w-full text-left text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-2"
              >
                <span>View all results for &quot;{query}&quot;</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {showSuggestions && query.length >= 2 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl p-6 text-center animate-slide-up">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 font-medium">No products found</p>
          <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  )
}

