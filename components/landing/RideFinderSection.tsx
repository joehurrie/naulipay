'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ArrowRight, ShieldCheck, Zap, X, Bus, Phone } from 'lucide-react'
import { fareEstimates } from '@/lib/mock-data'
import { useRide } from '@/lib/ride-context'

const MATATU_FARE = fareEstimates['matatu']

export default function RideFinderSection() {
  const { setBookedVehicle, setRideSearched } = useRide()

  const [location, setLocation] = useState('')
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(false)
  const [showPaymentOverlay, setShowPaymentOverlay] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!location || !destination) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setResults(true)
      setBookedVehicle('matatu')
      setRideSearched(true)
    }, 1100)
  }

  const resetSearch = () => {
    setResults(false)
    setBookedVehicle(null)
    setRideSearched(false)
    setLocation('')
    setDestination('')
  }

  return (
    <section
      id="ride-finder"
      className="relative min-h-screen flex flex-col justify-center bg-black py-24 overflow-hidden"
    >
      {/* Faint traffic bg */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
        style={{ backgroundImage: `url('/bus1.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/4 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left copy ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            <span className="label-sm text-brand-orange">Book Instantly</span>
            <h2 className="heading-lg text-white">Find matatus in your area</h2>
            <p className="body-lg text-zinc-400 max-w-md">
              Enter your route to check live matatu availability, estimated arrival times, and transparent fare breakdowns before you board.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              {[
                {
                  icon: <ShieldCheck className="w-4 h-4" />,
                  title: 'Guaranteed Pricing',
                  desc: 'The estimate you see is locked — no unexpected fare changes.',
                },
                {
                  icon: <Zap className="w-4 h-4" />,
                  title: 'NauliPass Card Enabled',
                  desc: 'All boarded matatus accept the NauliPass NFC card and in-app payments.',
                },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
                  <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">{item.title}</h4>
                    <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right form / results ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="card-dark border-zinc-800 bg-zinc-950/90 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden relative"
          >
            {/* ── Search form ── */}
            <form onSubmit={handleSearch} className="p-8 flex flex-col gap-5">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-grotesk text-xl font-medium text-white">Matatu Route Finder</h3>
                  <p className="text-zinc-500 text-xs">Enter your pickup and destination</p>
                </div>
              </div>

              {/* Inputs */}
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-orange" />
                  <input
                    type="text" required
                    placeholder="Pickup point — e.g. Westlands"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input-field pl-11"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text" required
                    placeholder="Destination — e.g. Nairobi CBD"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-sm font-semibold justify-center"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Find Available Matatus <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {/* ── Results — expanding downwards ── */}
            <AnimatePresence>
              {results && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col px-8 pb-8 gap-5 border-t border-zinc-800/60 pt-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-grotesk text-lg font-medium text-white">Available Matatus Near You</h4>
                        <p className="text-zinc-500 text-xs mt-0.5">{location} → {destination}</p>
                      </div>
                      <button onClick={resetSearch} className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Results */}
                    <div className="flex flex-col gap-3 flex-1">
                      {/* Primary */}
                      <div className="p-5 rounded-2xl bg-brand-orange/8 border border-brand-orange/25 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center text-white">
                            <Bus className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">Matatu — Route 111 (Direct)</p>
                            <p className="text-zinc-500 text-xs">{MATATU_FARE.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-brand-orange font-grotesk">KES {MATATU_FARE.base}</p>
                          <p className="text-zinc-500 text-xs">{MATATU_FARE.time}</p>
                        </div>
                      </div>

                      {/* Second route */}
                      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                            <Bus className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-zinc-300 font-medium text-sm">Matatu — Route 58 (Via CBD)</p>
                            <p className="text-zinc-600 text-xs">~5 min away</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-semibold text-zinc-300">KES {MATATU_FARE.base + 20}</p>
                        </div>
                      </div>

                      {/* ETAs */}
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {[
                          { label: 'ETA', value: '~3 min' },
                          { label: 'Journey', value: MATATU_FARE.time },
                          { label: 'Seats', value: '14' },
                        ].map(item => (
                          <div key={item.label} className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/60 text-center">
                            <p className="text-[10px] text-zinc-500">{item.label}</p>
                            <p className="text-xs font-semibold text-white mt-1">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button onClick={() => setShowPaymentOverlay(true)} className="btn-primary w-full py-3.5 text-xs font-semibold uppercase tracking-wider justify-center">
                        Confirm Ride via Naulipay App
                      </button>
                      <p className="text-center text-zinc-600 text-xs">Paid via NauliPass Card or in-app payment</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Payment Overlay Demo */}
            <AnimatePresence>
              {showPaymentOverlay && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-sm overflow-hidden bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 shadow-2xl rounded-3xl p-6"
                  >
                    <button
                      onClick={() => setShowPaymentOverlay(false)}
                      className="absolute top-4 right-4 p-2 text-zinc-400 hover:bg-white/5 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="text-center mb-6 mt-2">
                      <h3 className="text-xl font-bold text-white">Confirm Payment</h3>
                      <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                        For Fleet No: <span className="font-semibold text-white">11</span><br />
                        From <span className="font-semibold text-white">{location || 'CBD'}</span> to <span className="font-semibold text-white">{destination || 'Westlands'}</span><br />
                        Total Amount: <strong className="text-brand-orange">KES {MATATU_FARE.base}</strong>
                      </p>
                      <p className="text-xs text-zinc-500 mt-3">
                        Enter M-Pesa phone number below to complete transaction.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="254 7XX XXX XXX"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-zinc-600"
                        />
                      </div>
                      <button
                        className="w-full bg-brand-orange text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-brand-orange/25 hover:shadow-brand-orange/40 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                        onClick={() => {
                          setShowPaymentOverlay(false)
                        }}
                      >
                        Pay KES {MATATU_FARE.base}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
