'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation, Clock, Zap, Users, Bus, Car, Bike } from 'lucide-react'
import { VehicleType, fareEstimates, mapVehiclePins } from '@/lib/mock-data'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
})

export default function FleetSection() {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('matatu')

  const fare = fareEstimates[selectedVehicle]
  const vehicles: VehicleType[] = ['matatu', 'taxi', 'boda']

  const vehicleColors: Record<VehicleType, string> = {
    matatu: '#FF6B00',
    taxi: '#F59E0B',
    boda: '#10B981',
  }

  const alternativeFares = vehicles
    .filter(v => v !== selectedVehicle)
    .map(v => ({ type: v, ...fareEstimates[v] }))

  // Returns minimal Lucide icon for each vehicle type
  const getIcon = (type: VehicleType, className = "w-4 h-4") => {
    switch (type) {
      case 'matatu': return <Bus className={className} />
      case 'taxi': return <Car className={className} />
      case 'boda': return <Bike className={className} />
    }
  }

  return (
    <section id="fleet" className="bg-black border-b border-zinc-900/60 relative overflow-hidden min-h-screen flex flex-col justify-center py-24">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/3 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">

        {/* ── Section Header ── */}
        <motion.div {...fadeUp(0)} className="mb-14">
          <p className="label-sm text-brand-orange mb-4">Live Fleet Status</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="heading-lg text-white max-w-xl">
              Real-time ride tracking<br />
              across Nairobi
            </h2>
            <p className="body-lg text-zinc-500 max-w-xs sm:text-right">
              Track active vehicles on our platform and compare fares instantly
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">

          {/* ── Map Panel ── */}
          <motion.div
            {...fadeUp(0.1)}
            className="lg:col-span-2 rounded-3xl overflow-hidden relative border border-zinc-800 shadow-2xl min-h-[460px] lg:min-h-0"
          >
            {/* Real Map Image Background for Mocking Locations */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80)',
              }}
            />
            {/* Dark glass overlay to make pins highly visible */}
            <div className="absolute inset-0 bg-zinc-950/70" />

            {/* Mock Vector Street Paths for tech aesthetic */}
            <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
              <path d="M-10,120 Q120,150 250,80 T600,100" fill="none" stroke="#FF6B00" strokeWidth="1" opacity="0.3" />
              <path d="M120,-10 L150,500" fill="none" stroke="#FF6B00" strokeWidth="1" opacity="0.2" />
              <path d="M450,-10 L300,500" fill="none" stroke="#FF6B00" strokeWidth="1" opacity="0.2" />
              <text x="35%" y="20%" fill="#FF6B00" fontSize="10" opacity="0.6" fontFamily="Space Mono">Nairobi CBD</text>
              <text x="10%" y="80%" fill="#FF6B00" fontSize="8" opacity="0.4" fontFamily="Space Mono">Westlands</text>
            </svg>

            {/* Vehicle Pins - Minimal and Non-Cartoonish */}
            {mapVehiclePins.map((pin, i) => (
              <motion.div
                key={pin.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08 + 0.3 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pin.lng}%`, top: `${pin.lat}%` }}
              >
                {/* Minimal pulse ring */}
                <div
                  className="absolute inset-0 rounded-full animate-ping-slow opacity-25"
                  style={{ backgroundColor: vehicleColors[pin.type], transform: 'scale(2)' }}
                />
                
                {/* Minimal pin dot with Lucide icons (non-cartoonish) */}
                <div
                  className="relative w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200 z-10 border border-white/20"
                  style={{ backgroundColor: vehicleColors[pin.type] }}
                >
                  {getIcon(pin.type, "w-4 h-4 text-white")}
                </div>
                
                {/* Minimal text indicator */}
                <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-zinc-900/95 backdrop-blur-md border border-zinc-800 text-[10px] text-zinc-300 font-mono px-2 py-0.5 rounded-md whitespace-nowrap shadow-xl">
                  {pin.label}
                </div>
              </motion.div>
            ))}

            {/* Live badge */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-zinc-800/80 rounded-xl px-3 py-2 flex items-center gap-2 z-10">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-white text-xs font-medium">Live Grid • Nairobi</span>
            </div>

            {/* Vehicle filter legend */}
            <div className="absolute bottom-4 left-4 flex gap-2 z-10">
              {vehicles.map(v => (
                <button
                  key={v}
                  onClick={() => setSelectedVehicle(v)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                    selectedVehicle === v
                      ? 'text-white border-transparent'
                      : 'bg-black/60 backdrop-blur-sm text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700'
                  }`}
                  style={selectedVehicle === v ? { backgroundColor: vehicleColors[v] } : {}}
                >
                  {getIcon(v, "w-3.5 h-3.5")}
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>

            {/* Active count */}
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-zinc-800/80 rounded-xl px-3 py-2 z-10">
              <span className="text-brand-orange font-bold text-lg font-grotesk">24</span>
              <span className="text-zinc-500 text-xs ml-1.5">active</span>
            </div>
          </motion.div>

          {/* ── Fare Estimator ── */}
          <motion.div {...fadeUp(0.2)} className="flex flex-col gap-4 justify-between">

            {/* Primary Fare Card */}
            <div className="card-dark p-6 rounded-3xl flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Navigation className="w-4 h-4 text-brand-orange" />
                  <span className="text-zinc-400 text-sm font-medium">Active Selection</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedVehicle}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center py-2">
                      <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-zinc-800 text-brand-orange">
                        {getIcon(selectedVehicle, "w-6 h-6")}
                      </div>
                      <div className="text-zinc-500 text-xs capitalize mb-1 font-mono-brand">Nauli {selectedVehicle}</div>
                      <div className="text-brand-orange text-4xl font-bold font-grotesk">KES {fare.base}</div>
                      <div className="text-zinc-500 text-xs mt-2 font-light">{fare.description}</div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-white/5 border border-zinc-800/60 rounded-xl p-3 text-center">
                  <Clock className="w-4 h-4 text-brand-orange mx-auto mb-1.5" />
                  <div className="text-white font-semibold text-sm">{fare.time}</div>
                  <div className="text-zinc-500 text-[10px]">Est. time</div>
                </div>
                <div className="bg-white/5 border border-zinc-800/60 rounded-xl p-3 text-center">
                  <Zap className="w-4 h-4 text-brand-orange mx-auto mb-1.5" />
                  <div className="text-white font-semibold text-sm">
                    {selectedVehicle === 'matatu' ? '14 seats' : selectedVehicle === 'taxi' ? '4 seats' : '1 seat'}
                  </div>
                  <div className="text-zinc-500 text-[10px]">Capacity</div>
                </div>
              </div>
            </div>

            {/* Alternatives */}
            <div className="card-dark p-5 rounded-3xl">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-3 font-mono-brand">Alternatives</p>
              <div className="space-y-1">
                {alternativeFares.map(alt => (
                  <button
                    key={alt.type}
                    onClick={() => setSelectedVehicle(alt.type)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors duration-150 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-zinc-400 group-hover:text-brand-orange transition-colors">
                        {getIcon(alt.type, "w-4 h-4")}
                      </div>
                      <div className="text-left">
                        <div className="text-zinc-300 font-medium text-sm capitalize">{alt.type}</div>
                        <div className="text-zinc-500 text-xs">{alt.time}</div>
                      </div>
                    </div>
                    <div className="text-brand-orange font-bold text-sm">KES {alt.base}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Users metric */}
            <div className="bg-brand-orange rounded-3xl p-5 flex items-center gap-4">
              <Users className="w-8 h-8 text-white/80" />
              <div>
                <div className="text-white font-bold text-xl font-grotesk">2,450+</div>
                <div className="text-white/85 text-xs">commuters connected right now</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
