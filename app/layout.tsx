import './globals.css'

export const metadata = {
  title: 'Market Intelligence Dashboard',
  description: 'Sales opportunity tracking and analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
