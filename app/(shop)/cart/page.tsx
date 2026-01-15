import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import NavBar from '@/components/NavBar'
import CartPageClient from '@/components/cart/CartPageClient'

export default async function CartPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/cart')
  }

  return (
    <>
      <NavBar />
      <CartPageClient />
    </>
  )
}

