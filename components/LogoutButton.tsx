'use client'

'use client'

import { useRouter } from 'next/navigation'
import Button from './ui/Button'

export default function LogoutButton() {
  const router = useRouter()
  
  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <Button
      variant="outline"
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  )
}


