import './globals.css'

export const metadata = {
  title: 'E-Commerce App',
  description: 'Modern e-commerce platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

