'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bus, Car, Bike, ArrowRight, Users, Clock, MapPin } from 'lucide-react'
import { fareEstimates, VehicleType } from '@/lib/mock-data'

const vehicles: {
  type: VehicleType
  label: string
  tagline: string
  description: string
  icon: React.ReactNode
  image: string
  accentColor: string
  capacity: string
  routes: string
}[] = [
  {
    type: 'matatu',
    label: 'Matatu',
    tagline: 'Fixed route · Up to 14 passengers',
    description: 'Kenya\'s iconic minibuses running fixed routes across Nairobi. Affordable, frequent, and part of everyday life.',
    icon: <Bus className="w-5 h-5" />,
    // Busy city bus / minibus passengers
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&q=85',
    accentColor: '#FF6B00',
    capacity: '14 seats',
    routes: 'Fixed routes',
  },
  {
    type: 'taxi',
    label: 'Taxi',
    tagline: 'Point-to-point · Private ride',
    description: 'Private, comfortable, door-to-door rides anywhere in Nairobi. Perfect for airport transfers and longer trips.',
    icon: <Car className="w-5 h-5" />,
    // Taxi / sedan on road
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=85',
    accentColor: '#F59E0B',
    capacity: '4 seats',
    routes: 'Any destination',
  },
  {
    type: 'boda',
    label: 'Boda',
    tagline: 'Motorcycle · Beat the traffic',
    description: 'Navigate Nairobi traffic at speed with our network of registered boda boda riders. Fastest option for short trips.',
    icon: <Bike className="w-5 h-5" />,
    // Motorcycle / urban riding
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=85',
    accentColor: '#10B981',
    capacity: '1 passenger',
    routes: 'Short trips',
  },
]

export default function VehicleShowcaseSection() {
  const [active, setActive] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % vehicles.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const vehicle = vehicles[active]
  const fare = fareEstimates[vehicle.type]

  return (
    <section
      id="vehicles"
      className="relative min-h-screen flex flex-col overflow-hidden bg-zinc-950 border-b border-zinc-900/60"
    >
      {/* ── Animated photo banner — full bg ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${vehicle.image})` }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/72" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Navbar spacer */}
      <div className="h-16 flex-shrink-0" />

      {/* ── Content ── */}
      <div className="flex-1 flex items-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Dynamic content */}
            <div>
              {/* Section label */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="label-sm text-zinc-500 mb-6"
              >
                Our fleet
              </motion.p>

              {/* Vehicle type badges */}
              <div className="flex gap-2 mb-10">
                {vehicles.map((v, i) => (
                  <button
                    key={v.type}
                    onClick={() => { setActive(i); setIsAutoPlaying(false) }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                      active === i
                        ? 'text-white border-transparent shadow-lg'
                        : 'bg-black/30 text-zinc-400 border-zinc-700/50 hover:border-zinc-600 backdrop-blur-sm'
                    }`}
                    style={active === i ? { backgroundColor: v.accentColor, borderColor: v.accentColor } : {}}
                  >
                    {v.icon}
                    {v.label}
                  </button>
                ))}
              </div>

              {/* Dynamic heading */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`heading-${active}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h2 className="heading-lg text-white mb-4">
                    {vehicle.label}
                  </h2>
                  <p className="text-zinc-400 text-base sm:text-lg font-light leading-relaxed mb-8 max-w-md">
                    {vehicle.description}
                  </p>

                  {/* Quick stats */}
                  <div className="flex flex-wrap gap-4 mb-10">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-zinc-800 rounded-xl px-4 py-2.5">
                      <Users className="w-4 h-4 text-zinc-400" />
                      <span className="text-white text-sm font-medium">{vehicle.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-zinc-800 rounded-xl px-4 py-2.5">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      <span className="text-white text-sm font-medium">{fare.time} avg</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-zinc-800 rounded-xl px-4 py-2.5">
                      <MapPin className="w-4 h-4 text-zinc-400" />
                      <span className="text-white text-sm font-medium">{vehicle.routes}</span>
                    </div>
                  </div>

                  <a href="#ride-finder" className="btn-primary px-8 py-3.5 text-sm font-medium">
                    Book a {vehicle.label}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Fare card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`card-${active}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="card-glass p-6 sm:p-8 max-w-sm"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-5"
                  style={{ backgroundColor: vehicle.accentColor }}
                >
                  {vehicle.icon}
                </div>

                <p className="text-zinc-500 text-xs mb-1 font-mono-brand uppercase tracking-widest">
                  Starting fare
                </p>
                <p
                  className="text-5xl font-bold font-grotesk mb-1"
                  style={{ color: vehicle.accentColor }}
                >
                  KES {fare.base}
                </p>
                <p className="text-zinc-500 text-sm mb-8">{fare.description}</p>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm border-b border-zinc-800/60 pb-3">
                    <span className="text-zinc-500">Avg. journey time</span>
                    <span className="text-white font-medium">{fare.time}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-zinc-800/60 pb-3">
                    <span className="text-zinc-500">Capacity</span>
                    <span className="text-white font-medium">{vehicle.capacity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Payment</span>
                    <span className="text-white font-medium">NFC · M-Pesa · Wallet</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-800/60">
                  <p className="text-zinc-600 text-xs">Loyalty points earned per trip</p>
                  <p className="text-brand-orange font-semibold text-sm mt-0.5">
                    +{Math.round(fare.base * 0.2)} points (~KES {Math.round(fare.base * 0.02)} value)
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Progress bar indicator ── */}
      <div className="relative z-10 flex-shrink-0 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            {vehicles.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActive(i); setIsAutoPlaying(false) }}
                className="relative h-0.5 flex-1 bg-zinc-800 rounded-full overflow-hidden"
              >
                {active === i && isAutoPlaying && (
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-brand-orange rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4, ease: 'linear' }}
                  />
                )}
                {active === i && !isAutoPlaying && (
                  <div className="absolute inset-0 bg-brand-orange rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
