'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ArrowRight, Star, Navigation, Search, CreditCard, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { vehicleEmojis, vehicleLabels } from '@/lib/mock-data'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
})

// Mock available matatus
const availableMatatus = [
  { id: '1', plate: 'KDA 123X', type: 'shuttle', fare: 120, time: '2 mins away' },
  { id: '2', plate: 'KCB 456Y', type: 'bus', fare: 80, time: '5 mins away' },
  { id: '3', plate: 'KDE 789Z', type: 'premium', fare: 170, time: '8 mins away' },
]

export default function TrackMatatuSection() {
  const [step, setStep] = useState<'route' | 'searching' | 'select' | 'payment' | 'processing' | 'success'>('route')
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [selectedMatatu, setSelectedMatatu] = useState<typeof availableMatatus[0] | null>(null)
  const [phone, setPhone] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickup || !destination) return
    setStep('searching')
    setTimeout(() => {
      setStep('select')
    }, 1500)
  }

  const handleSelect = (matatu: typeof availableMatatus[0]) => {
    setSelectedMatatu(matatu)
    setStep('payment')
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) return
    setStep('processing')
    setTimeout(() => {
      if (selectedMatatu) {
        const newTrip = {
          id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
          vehicleType: selectedMatatu.type,
          category: selectedMatatu.type,
          route: `${pickup || 'CBD'} → ${destination || 'Westlands'}`,
          from: pickup || 'CBD',
          to: destination || 'Westlands',
          fare: selectedMatatu.fare,
          status: 'completed',
          date: new Date().toISOString().split('T')[0],
          requested_at: new Date().toISOString(),
          driver: 'Matatu Driver',
          plate: selectedMatatu.plate,
          points: Math.floor(selectedMatatu.fare / 5),
          paymentMethod: 'mpesa',
          duration: 'Scheduled',
          fare_estimate: { estimated_total: selectedMatatu.fare }
        }
        try {
          const existing = JSON.parse(localStorage.getItem('naulipass_user_trips') || '[]')
          localStorage.setItem('naulipass_user_trips', JSON.stringify([newTrip, ...existing]))
          window.dispatchEvent(new Event('naulipass_trip_added'))
        } catch (err) {
          console.error(err)
        }
      }
      setStep('success')
    }, 2000)
  }

  const resetForm = () => {
    setPickup('')
    setDestination('')
    setSelectedMatatu(null)
    setPhone('')
    setStep('route')
  }

  return (
    <section id="track" className="relative bg-black py-24 overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/4 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp(0)} className="flex flex-col gap-6">
            <span className="label-sm text-brand-orange">Never Miss Your Ride</span>
            <h2 className="heading-lg text-white">Book and track instantly</h2>
            <p className="body-lg text-zinc-400 max-w-md">
              Find available matatus for your route, pay seamlessly with your mobile wallet, and track your ride in real-time.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              {[
                {
                  icon: <Search className="w-4 h-4" />,
                  title: 'Search by route',
                  desc: 'Find the closest available matatus for your specific pickup and destination.',
                },
                {
                  icon: <CreditCard className="w-4 h-4" />,
                  title: 'Cashless payments',
                  desc: 'Pay instantly via M-Pesa or Nualipass. No need to carry cash or wait for change.',
                },
                {
                  icon: <Star className="w-4 h-4" />,
                  title: 'Save your favorites',
                  desc: 'Keep a personal list of matatus you ride regularly right in your account.',
                },
              ].map((item) => (
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

            <Link href="/login" className="btn-primary w-fit py-3.5 px-6 text-sm font-semibold mt-4">
              Sign in for live tracking <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="card-dark border-zinc-800 bg-zinc-950/90 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden min-h-[440px] flex flex-col">
            <div className="p-6 border-b border-zinc-800/80 bg-zinc-900/30">
              <h3 className="font-grotesk text-xl font-medium text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-brand-orange" /> Find a Ride
              </h3>
            </div>

            <div className="p-6 flex-1 relative flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {step === 'route' && (
                  <motion.form
                    key="route"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleSearch}
                    className="flex flex-col gap-5 h-full justify-center w-full"
                  >
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Pickup Location</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-orange" />
                        <input
                          type="text"
                          required
                          value={pickup}
                          onChange={e => setPickup(e.target.value)}
                          placeholder="e.g. Westlands"
                          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-brand-orange transition-colors"
                        />
                      </div>
                    </div>

                    <div className="relative pl-5 -my-2 flex justify-start z-0">
                      <div className="w-px h-6 bg-zinc-800" />
                    </div>

                    <div className="relative z-10">
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Destination</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                        <input
                          type="text"
                          required
                          value={destination}
                          onChange={e => setDestination(e.target.value)}
                          placeholder="e.g. CBD"
                          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-brand-orange transition-colors"
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary w-full py-3.5 mt-2 text-sm font-semibold shadow-brand">
                      Search Available Matatus
                    </button>
                  </motion.form>
                )}

                {step === 'searching' && (
                  <motion.div
                    key="searching"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full gap-4 text-center py-12 absolute inset-0 w-full"
                  >
                    <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
                    <div>
                      <p className="text-white font-medium">Finding rides...</p>
                      <p className="text-zinc-500 text-sm mt-1">Scanning the grid for available matatus</p>
                    </div>
                  </motion.div>
                )}

                {step === 'select' && (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col h-full absolute inset-0 p-6 w-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-zinc-400">Available on your route</p>
                      <button onClick={() => setStep('route')} className="text-xs text-brand-orange hover:underline">Change route</button>
                    </div>

                    <div className="flex flex-col gap-3 overflow-y-auto pr-2 max-h-[300px] custom-scrollbar">
                      {availableMatatus.map(matatu => (
                        <button
                          key={matatu.id}
                          onClick={() => handleSelect(matatu)}
                          className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-brand-orange/60 hover:bg-zinc-800/50 transition-all text-left group"
                        >
                          <div className="text-2xl w-10 h-10 flex items-center justify-center bg-zinc-950 rounded-lg border border-zinc-800 group-hover:bg-brand-orange/10 group-hover:border-brand-orange/30 transition-colors">
                            {vehicleEmojis[matatu.type as keyof typeof vehicleEmojis] || '🚌'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm flex items-center justify-between">
                              {matatu.plate}
                              <span className="text-brand-orange font-bold text-base">KES {matatu.fare}</span>
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-zinc-500 text-xs">{vehicleLabels[matatu.type as keyof typeof vehicleLabels] || 'Matatu'}</p>
                              <p className="text-emerald-500/90 text-xs font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {matatu.time}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 'payment' && selectedMatatu && (
                  <motion.form
                    key="payment"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handlePayment}
                    className="flex flex-col h-full justify-center absolute inset-0 p-6 w-full"
                  >
                    <div className="bg-zinc-900/60 rounded-xl p-4 border border-zinc-800 mb-6">
                      <div className="flex items-center justify-between text-sm mb-3 pb-3 border-b border-zinc-800/60">
                        <span className="text-zinc-400">Selected Matatu</span>
                        <div className="flex items-center gap-2">
                          <span>{vehicleEmojis[selectedMatatu.type as keyof typeof vehicleEmojis]}</span>
                          <span className="text-white font-medium">{selectedMatatu.plate}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">Total Fare</span>
                        <span className="text-brand-orange font-bold text-lg">KES {selectedMatatu.fare}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">M-Pesa Phone Number</label>
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 px-3 bg-zinc-800/80 flex items-center justify-center rounded-l-xl border-y border-l border-zinc-700 text-zinc-300 text-sm font-medium">
                          +254
                        </div>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                          maxLength={9}
                          placeholder="7XX XXX XXX"
                          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3.5 pl-16 pr-4 text-white text-sm focus:outline-none focus:border-brand-orange transition-colors font-mono tracking-wide"
                        />
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-2">An STK push will be sent to your phone to complete the payment.</p>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button type="button" onClick={() => setStep('select')} className="px-4 py-3.5 text-sm text-zinc-400 hover:text-white transition-colors border border-zinc-800 rounded-xl hover:bg-zinc-800">
                        Back
                      </button>
                      <button type="submit" className="flex-1 btn-primary py-3.5 text-sm font-semibold shadow-brand">
                        Pay KES {selectedMatatu.fare}
                      </button>
                    </div>
                  </motion.form>
                )}

                {step === 'processing' && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full gap-4 text-center py-12 absolute inset-0 w-full"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-brand-orange/20 rounded-full blur-xl animate-pulse" />
                      <Loader2 className="w-12 h-12 text-brand-orange animate-spin relative z-10" />
                    </div>
                    <div className="mt-2">
                      <p className="text-white font-medium text-lg">Processing Payment</p>
                      <p className="text-zinc-400 text-sm mt-1 max-w-[200px] mx-auto">Please check your phone and enter your M-Pesa PIN.</p>
                    </div>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-4 text-center py-8 absolute inset-0 w-full px-6"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl" />
                      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center relative z-10">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h3>
                      <p className="text-zinc-300 text-sm max-w-[320px] mx-auto leading-relaxed">
                        thank you for your booking on vehicle <span className="text-brand-orange font-semibold">{selectedMatatu?.plate}</span>... your payment is well received, enjoy ride
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
