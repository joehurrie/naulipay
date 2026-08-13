import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Naulipass — Convenient Rides, Seamless Payments',
  description: 'Naulipass is East Africa\'s smartest urban transit payment platform. Book Matatus, Taxis, and Bodas with tap-to-pay technology, loyalty rewards, and micro-credit services.',
  keywords: ['matatu', 'taxi', 'boda', 'nairobi', 'transit', 'tap-to-pay', 'NFC', 'RFID', 'Kenya', 'commuter'],
  openGraph: {
    title: 'Naulipass — Convenient Rides, Seamless Payments',
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
      <body className="antialiased">{children}</body>
    </html>
  )
}
