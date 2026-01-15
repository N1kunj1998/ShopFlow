'use client'

import { useEffect, useState } from 'react'

interface Message {
  message: string
  timestamp: string
}

export default function Home() {
  const [data, setData] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
        E-Commerce App
      </h1>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div style={{ color: 'red' }}>
          <p>Error: {error}</p>
        </div>
      )}
      
      {data && (
        <div style={{ 
          padding: '2rem', 
          border: '1px solid #ccc', 
          borderRadius: '8px',
          textAlign: 'center',
          backgroundColor: '#f9f9f9'
        }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            {data.message}
          </p>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </main>
  )
}

