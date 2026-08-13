'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react'
import { VehicleType, fareEstimates } from '@/lib/mock-data'

const vehicles: { type: VehicleType; label: string; description: string; baseFare: number }[] = [
  { type: 'matatu', label: 'Matatu', description: 'Fixed routes & stages', baseFare: 70 },
  { type: 'taxi', label: 'Taxi', description: 'Private direct ride', baseFare: 650 },
  { type: 'boda', label: 'Boda', description: 'Fast motorcycle transit', baseFare: 120 },
]

export default function RideFinderSection() {
  const [selected, setSelected] = useState<VehicleType>('matatu')
  const [location, setLocation] = useState('')
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<boolean>(false)

  const activeVehicle = vehicles.find(v => v.type === selected)
  const fare = fareEstimates[selected]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!location || !destination) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setResults(true)
    }, 1200)
  }

  return (
    <section
      id="ride-finder"
      className="relative min-h-screen flex flex-col justify-center bg-black py-24 text-white overflow-hidden"
    >
      {/* Background Traffic Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1600&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            <span className="label-sm text-brand-orange">Book Instantly</span>
            <h2 className="heading-lg">Find rides in your area</h2>
            <p className="body-lg text-zinc-400">
              Enter your route details to check live vehicle availability, estimated arrival times, and transparent fare breakdowns before you travel.
            </p>
            
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange flex-shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Guaranteed Pricing</h4>
                  <p className="text-zinc-500 text-xs mt-1">The estimate you see is locked. No unexpected surge pricing or delays.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange flex-shrink-0">
                  <HelpCircle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Tap-to-Pay Enabled</h4>
                  <p className="text-zinc-500 text-xs mt-1">All boarded vehicles accept NauliPass NFC cards and instant M-Pesa push notifications.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Form Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="card-dark border-zinc-800 p-8 shadow-2xl bg-zinc-950/80 backdrop-blur-xl relative"
          >
            <form onSubmit={handleSearch} className="flex flex-col gap-5">
              <div>
                <h3 className="font-grotesk text-xl font-medium mb-1">Route Calculator</h3>
                <p className="text-zinc-500 text-xs">Specify pickup and drop-off to search live matrix</p>
              </div>

              {/* Pickup & Destination inputs */}
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-orange" />
                  <input
                    type="text"
                    required
                    placeholder="Enter pickup point (e.g. Westlands)..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input-field pl-11"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="Enter destination (e.g. CBD)..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="input-field pl-11"
                  />
                </div>
              </div>

              {/* Transit Type Selector */}
              <div>
                <label className="text-zinc-500 text-xs font-mono-brand uppercase tracking-widest block mb-3">
                  Vehicle Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {vehicles.map((v) => (
                    <button
                      key={v.type}
                      type="button"
                      onClick={() => setSelected(v.type)}
                      className={`relative px-4 py-3.5 rounded-xl border text-center transition-all duration-300 ${
                        selected === v.type
                          ? 'border-brand-orange bg-brand-orange/10 text-white font-medium'
                          : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="text-sm font-semibold">{v.label}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">KES {v.baseFare}+</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-sm font-semibold flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Calculate Live Fares
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Results Animation Overlay */}
            <AnimatePresence>
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute inset-0 bg-zinc-950 rounded-2xl p-8 border border-zinc-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-grotesk text-lg font-medium">Available {activeVehicle?.label}s</h4>
                      <button
                        onClick={() => setResults(false)}
                        className="text-zinc-500 hover:text-white text-xs"
                      >
                        Reset Search
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                        <div>
                          <p className="text-xs text-zinc-500">Route Code</p>
                          <p className="text-sm font-medium text-white">{selected === 'matatu' ? 'Route 111 (Direct)' : 'Direct Express'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-zinc-500">Fare Estimate</p>
                          <p className="text-lg font-bold text-brand-orange">KES {fare.base}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-1">
                        <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                          <p className="text-[10px] text-zinc-500">ETA to Pick-up</p>
                          <p className="text-xs font-semibold text-white mt-1">~5 mins</p>
                        </div>
                        <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                          <p className="text-[10px] text-zinc-500">Estimated Duration</p>
                          <p className="text-xs font-semibold text-white mt-1">{fare.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      alert('Redirecting to NauliPass mobile application link...')
                      setResults(false)
                    }}
                    type="button"
                    className="btn-primary w-full py-3.5 text-xs font-semibold uppercase tracking-wider"
                  >
                    Confirm & Request Ride
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
