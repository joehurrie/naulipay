'use client'

import { motion } from 'framer-motion'
import { Bus } from 'lucide-react'
import { mapVehiclePins } from '@/lib/mock-data'
import { useRide } from '@/lib/ride-context'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
})

const matutuPins = mapVehiclePins

export default function FleetSection() {
  const { rideSearched } = useRide()

  return (
    <section
      id="fleet"
      className="bg-black border-b border-zinc-900/60 relative overflow-hidden py-24"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/3 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">

        {/* ── Header ── */}
        <motion.div {...fadeUp(0)} className="mb-14">
          <p className="label-sm text-brand-orange mb-4">Live Fleet Status</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="heading-lg text-white max-w-xl">
              Real-time matatu tracking<br />across Nairobi
            </h2>
            <p className="body-lg text-zinc-500 max-w-xs sm:text-right">
              {rideSearched
                ? 'Showing active matatus matching your search'
                : 'See exactly where matatus are right now'}
            </p>
          </div>
        </motion.div>

        {/* ── Full-width map ── */}
        <motion.div
          {...fadeUp(0.1)}
          className="rounded-3xl overflow-hidden relative border border-zinc-800 shadow-2xl"
          style={{ height: '500px' }}
        >
          {/* Map background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80)' }}
          />
          <div className="absolute inset-0 bg-zinc-950/68" />

          {/* Street lines SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <path d="M-10,180 Q200,220 450,130 T900,160" fill="none" stroke="#FF5F00" strokeWidth="1.5" opacity="0.4" />
            <path d="M-10,320 Q180,290 380,340 T900,310" fill="none" stroke="#FF5F00" strokeWidth="1" opacity="0.2" />
            <path d="M180,-10 L210,540"  fill="none" stroke="#FF5F00" strokeWidth="1" opacity="0.2" />
            <path d="M520,-10 L480,540"  fill="none" stroke="#FF5F00" strokeWidth="1" opacity="0.2" />
            <path d="M750,-10 L700,540"  fill="none" stroke="#FF5F00" strokeWidth="1" opacity="0.15" />
            <text x="32%" y="14%" fill="#FF5F00" fontSize="11" opacity="0.6" fontFamily="Space Mono">Nairobi CBD</text>
            <text x="6%"  y="82%" fill="#FF5F00" fontSize="9"  opacity="0.4" fontFamily="Space Mono">Westlands</text>
            <text x="68%" y="64%" fill="#FF5F00" fontSize="9"  opacity="0.4" fontFamily="Space Mono">Eastleigh</text>
            <text x="18%" y="50%" fill="#FF5F00" fontSize="9"  opacity="0.3" fontFamily="Space Mono">Ngara</text>
            <text x="55%" y="35%" fill="#FF5F00" fontSize="9"  opacity="0.3" fontFamily="Space Mono">Pangani</text>
          </svg>

          {/* Matatu Pins */}
          {matutuPins.map((pin, i) => (
            <motion.div
              key={pin.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.3, duration: 0.4, type: 'spring', stiffness: 200 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pin.lng}%`, top: `${pin.lat}%` }}
            >
              {rideSearched && (
                <div
                  className="absolute rounded-full animate-ping"
                  style={{
                    backgroundColor: '#FF5F00',
                    width: '32px', height: '32px',
                    top: 0, left: 0,
                    opacity: 0.3,
                    animationDuration: `${1.2 + i * 0.3}s`,
                  }}
                />
              )}
              <div className="relative w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg z-10 border border-white/20 bg-brand-orange">
                <Bus className="w-4 h-4 text-white" />
              </div>
              <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-zinc-900/95 backdrop-blur-md border border-zinc-800 text-[10px] text-zinc-300 font-mono px-2 py-0.5 rounded-md whitespace-nowrap shadow-xl z-20">
                {pin.label}
              </div>
            </motion.div>
          ))}

          {/* Live badge */}
          <div className="absolute top-5 left-5 bg-black/80 backdrop-blur-md border border-zinc-800/80 rounded-xl px-3 py-2 flex items-center gap-2 z-10">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-white text-xs font-medium">Live Grid · Nairobi</span>
          </div>

          {/* Active count badge */}
          <div className="absolute top-5 right-5 bg-black/80 backdrop-blur-md border border-zinc-800/80 rounded-xl px-4 py-2 z-10 flex items-center gap-2">
            <Bus className="w-3.5 h-3.5 text-brand-orange" />
            <span className="text-brand-orange font-bold text-base font-grotesk">{matutuPins.length}</span>
            <span className="text-zinc-500 text-xs">matatus active</span>
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950/90 to-transparent p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-zinc-400 text-xs">
                {rideSearched ? 'Showing your matched matatus' : 'All matatus reporting position'}
              </span>
            </div>
            <span className="text-zinc-600 text-[10px] font-mono">Updated just now</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
