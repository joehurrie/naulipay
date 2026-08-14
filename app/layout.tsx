import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Naulipay — Convenient Rides, Seamless Payments',
  description: 'Naulipay is East Africa\'s smartest urban transit payment platform. Book Matatus, Taxis, and Bodas with tap-to-pay technology, loyalty rewards, and micro-credit services.',
  keywords: ['matatu', 'taxi', 'boda', 'nairobi', 'transit', 'tap-to-pay', 'NFC', 'RFID', 'Kenya', 'commuter', 'naulipay'],
  openGraph: {
    title: 'Naulipay — Convenient Rides, Seamless Payments',
    description: 'East Africa\'s smartest urban transit payment platform.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
