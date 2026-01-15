'use client'

import { useSearchParams } from 'next/navigation'
import LoginForm from './LoginForm'

export default function LoginPageContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  
  return <LoginForm callbackUrl={callbackUrl} />
}

