'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, MapPin, CreditCard, CheckCircle } from 'lucide-react'

const steps = [
  {
    number: '02',
    icon: <MapPin className="w-5 h-5" />,
    title: 'Book & Track',
    description: 'Secure your seat with first-come-first-served booking. Track your ride live on GPS and share your journey link for peace of mind.',
    highlights: ['Instant seat confirmation', 'Live GPS route tracking', 'Share your trip link'],
    bgImage: '/insidemat.jpg',
  },
  {
    number: '01',
    icon: <Smartphone className="w-5 h-5" />,
    title: 'Select Your Ride',
    description: 'Choose from Matatu, Taxi, or Boda. View real-time availability, compare fares, and check estimated travel times across all options.',
    highlights: ['Compare fare estimates instantly', 'See live vehicle availability', 'Check travel time estimates'],
    bgImage: '/bus1.jpg',
  },
  {
    number: '03',
    icon: <CreditCard className="w-5 h-5" />,
    title: 'Tap & Pay',
    description: 'At your destination, tap your Nauli Pay NFC card on the terminal. Or pay via in-app payment. Earn loyalty points instantly.',
    highlights: ['Nauli Pay NFC card', 'In-app payments', 'Earn loyalty points'],
    bgImage: '/dere.jpg',
  },
]

// Circle circumference for r=180: 2π×180 ≈ 1131
const CIRC = 1131
// Total cycle: 30 seconds for full rotation (3 steps × 10s each)
const CYCLE_MS = 30000
const TICK_MS = 80

export default function HowItWorksSection() {
  // clockProgress: 0–100 (full 3-step cycle)
  const [clockProgress, setClockProgress] = useState(0)
  // clockStep: which step the clock hand is currently passing (0,1,2)
  const [clockStep, setClockStep] = useState(0)
  // selectedStep: which step card to DISPLAY (only changes on click)
  const [selectedStep, setSelectedStep] = useState(0)

  // Auto-advance clock
  useEffect(() => {
    const interval = setInterval(() => {
      setClockProgress(prev => {
        const next = (prev + (100 * TICK_MS) / CYCLE_MS) % 100
        // Which step does the clock hand sit on?
        const step = Math.floor((next / 100) * 3) % 3
        setClockStep(step)
        return next
      })
    }, TICK_MS)
    return () => clearInterval(interval)
  }, [])

  // Arc offset: full CIRC = empty, 0 = full. Clock sweeps continuously
  const dashOffset = CIRC * (1 - clockProgress / 100)

  const step = steps[selectedStep]

  // Angle for each step button on circle (top=0°, right-bottom=120°, left-bottom=240°)
  const stepAngles = [0, 120, 240]

  return (
    <section id="how-it-works" className="bg-brand-orange relative overflow-hidden min-h-screen flex flex-col justify-center py-24">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="label-sm text-white/70 mb-4">Simple Process</p>
          <h2 className="heading-lg text-white">How Naulipay works</h2>
          <p className="body-lg text-white/80 mt-4 max-w-lg mx-auto">
            From finding a ride to paying your fare — three simple steps
          </p>
        </div>

        <div className="relative flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

          {/* ── Orbit with clock animation ── */}
          <div className="relative flex items-center justify-center w-full lg:w-auto flex-shrink-0">
            <div className="relative" style={{ width: 440, height: 440, maxWidth: '90vw', maxHeight: '90vw' }}>

              <svg viewBox="0 0 480 480" className="w-full h-full" fill="none">
                {/* Static dashed track */}
                <circle cx="240" cy="240" r="180" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                <circle cx="240" cy="240" r="180" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="6 10" />

                {/* ── Clock arc — continuously sweeping ── */}
                <circle
                  cx="240" cy="240" r="180"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 240 240)"
                />

                {/* Step anchor dots */}
                {stepAngles.map((deg, i) => {
                  const rad = ((deg - 90) * Math.PI) / 180
                  const cx = 240 + 180 * Math.cos(rad)
                  const cy = 240 + 180 * Math.sin(rad)
                  return (
                    <circle
                      key={i}
                      cx={cx} cy={cy} r="6"
                      fill={clockStep >= i ? 'white' : 'rgba(0,0,0,0.3)'}
                      style={{ transition: 'fill 0.4s ease' }}
                    />
                  )
                })}

                {/* Clock hand dot — moves along the arc */}
                {(() => {
                  const angle = (clockProgress / 100) * 360 - 90
                  const rad = (angle * Math.PI) / 180
                  const hx = 240 + 180 * Math.cos(rad)
                  const hy = 240 + 180 * Math.sin(rad)
                  return (
                    <>
                      <circle cx={hx} cy={hy} r="16" fill="rgba(0,0,0,0.15)" />
                      <circle cx={hx} cy={hy} r="8" fill="black" />
                    </>
                  )
                })()}
              </svg>

              {/* Step buttons — turn white when clock reaches them */}
              {steps.map((s, i) => {
                const deg = i * 120
                const rad = ((deg - 90) * Math.PI) / 180
                const r = 48
                const cx = 50 + r * Math.cos(rad)
                const cy = 50 + r * Math.sin(rad)
                const isClockHere = clockStep === i
                const isSelected = selectedStep === i

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedStep(i)}
                    className="absolute inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold border backdrop-blur-sm transition-all duration-500 whitespace-nowrap"
                    style={{
                      left: `${cx}%`,
                      top: `${cy}%`,
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: isClockHere || isSelected ? 'black' : 'rgba(0,0,0,0.15)',
                      color: isClockHere || isSelected ? 'white' : 'rgba(255,255,255,0.7)',
                      borderColor: isClockHere || isSelected ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)',
                      boxShadow: isClockHere ? '0 0 20px rgba(255,255,255,0.2)' : 'none',
                    }}
                  >
                    <span className="w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <span>{s.title}</span>
                  </button>
                )
              })}

              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-16 pointer-events-none">
                <p className="text-white/40 text-[10px] font-mono-brand mb-1">PHASE {steps[clockStep].number}</p>
                <h3 className="font-grotesk text-lg font-medium text-white">{steps[clockStep].title}</h3>
              </div>
            </div>
          </div>

          {/* ── Detail card — only switches on click ── */}
          <div className="flex-1 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${step.bgImage})` }}
                />
                <div className="absolute inset-0 bg-black/75" />

                <div className="relative z-10 p-8 sm:p-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-orange rounded-2xl mb-6 text-white shadow-lg">
                    {step.icon}
                  </div>
                  <p className="text-white/40 text-xs font-mono-brand mb-2">STEP {step.number}</p>
                  <h3 className="heading-md text-white mb-4">{step.title}</h3>
                  <p className="body-lg text-white/70 mb-8 text-base sm:text-lg leading-relaxed">{step.description}</p>

                  <ul className="space-y-3.5">
                    {step.highlights.map(h => (
                      <li key={h} className="flex items-center gap-3 text-white/80 text-sm font-light">
                        <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* Dot nav */}
                  <div className="flex gap-2.5 mt-10">
                    {steps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedStep(i)}
                        className={`h-1 rounded-full transition-all duration-300 ${i === selectedStep ? 'bg-white w-8' : 'bg-white/30 w-4'}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 flex items-center gap-5 pl-2"
            >
              <button
                onClick={() => { document.getElementById('ride-finder')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="bg-black text-white font-medium px-8 py-3.5 rounded-full hover:bg-zinc-900 transition-colors text-sm border border-zinc-800"
              >
                Estimate Live Route
              </button>
              <p className="text-white/60 text-xs font-light">Calculated in real-time</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
