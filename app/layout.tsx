export const metadata = {
  title: 'E-Commerce App',
  description: 'Simple e-commerce frontend',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

