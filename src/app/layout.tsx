import './globals.css'
import type { Metadata } from 'next'
import { TradingProvider } from '@/contexts/TradingContext'

export const metadata: Metadata = {
  title: 'DEX Trading Platform',
  description: 'Advanced cryptocurrency trading platform with real-time order book and charting',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#1A1B1E] text-white">
        <TradingProvider>
          {children}
        </TradingProvider>
      </body>
    </html>
  )
}
