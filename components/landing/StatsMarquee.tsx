'use client'

const stats = [
  { label: '2,450+ Rides Completed' },
  { label: '24 Active Vehicles' },
  { label: 'KES 50 Avg Fare' },
  { label: 'Nairobi CBD' },
  { label: 'Tap-to-Pay NFC' },
  { label: 'In-App Payments' },
  { label: '3 Ride Types' },
  { label: 'Live GPS Tracking' },
]

export default function StatsMarquee() {
  // Duplicate for seamless loop
  const items = [...stats, ...stats]

  return (
    <div className="relative bg-black border-y border-zinc-900/60 py-4 overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <div className="flex marquee-track">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-5 flex-shrink-0 px-8"
          >
            <span className="font-mono-brand text-zinc-400 text-sm whitespace-nowrap tracking-tight">
              {item.label}
            </span>
            <span className="w-1.5 h-1.5 bg-brand-orange rounded-full flex-shrink-0 opacity-60" />
          </div>
        ))}
      </div>
    </div>
  )
}
