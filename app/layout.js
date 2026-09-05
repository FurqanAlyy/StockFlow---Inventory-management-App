import './globals.css'

export const metadata = {
  title: 'StockFlow',
  description: 'Modern inventory management system'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}