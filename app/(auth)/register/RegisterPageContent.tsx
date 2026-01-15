'use client'

import { useSearchParams } from 'next/navigation'
import RegisterForm from './RegisterForm'

export default function RegisterPageContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  
  return <RegisterForm callbackUrl={callbackUrl} />
}

