'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, MapPin, CreditCard, CheckCircle } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: <Smartphone className="w-5 h-5" />,
    title: 'Select Your Ride',
    description: 'Choose from Matatu, Taxi, or Boda. View real-time availability, compare fares, and check estimated travel times across all options.',
    highlights: ['Compare fare estimates instantly', 'See live vehicle availability', 'Check travel time estimates'],
    // Nairobi street transit scene
    bgImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  },
  {
    number: '02',
    icon: <MapPin className="w-5 h-5" />,
    title: 'Book & Track',
    description: 'Secure your seat with first-come-first-served booking. Track your ride live on GPS and share your journey link for peace of mind.',
    highlights: ['Instant seat confirmation', 'Live GPS route tracking', 'Share your trip link'],
    // Commuter checking phone / transport map
    bgImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  },
  {
    number: '03',
    icon: <CreditCard className="w-5 h-5" />,
    title: 'Tap & Pay',
    description: 'At your destination, simply tap your NFC card on the terminal. Or pay via in-app wallet, M-Pesa, or bank card. Earn loyalty points instantly.',
    highlights: ['NFC tap-to-pay', 'M-Pesa integration', 'Earn loyalty points'],
    // Modern NFC payment scene / credit card tap
    bgImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
  },
]

const CIRC = 1382

export default function HowItWorksSection() {
  const [active, setActive] = useState(0)

  const step = steps[active]
  const orbitOffsets = [CIRC, CIRC * 0.667, CIRC * 0.333]

  return (
    <section id="how-it-works" className="bg-brand-orange relative overflow-hidden min-h-screen flex flex-col justify-center py-24">
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

        {/* ── Header ── */}
        <div className="text-center mb-16">
          <p className="label-sm text-white/70 mb-4">Simple Process</p>
          <h2 className="heading-lg text-white">How Naulipass works</h2>
          <p className="body-lg text-white/80 mt-4 max-w-lg mx-auto">
            From finding a ride to paying your fare — three simple steps
          </p>
        </div>

        {/* ── Orbit + Content Layout ── */}
        <div className="relative flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

          {/* ── Left: Orbit SVG ── */}
          <div className="relative flex items-center justify-center w-full lg:w-auto flex-shrink-0">
            <div className="relative" style={{ width: 440, height: 440, maxWidth: '90vw', maxHeight: '90vw' }}>

              {/* SVG Orbit */}
              <svg
                viewBox="0 0 480 480"
                className="w-full h-full"
                fill="none"
              >
                {/* Dashed track */}
                <circle cx="240" cy="240" r="180" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                <circle cx="240" cy="240" r="180" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="6 10" />

                {/* Animated progress arc */}
                <circle
                  cx="240" cy="240" r="180"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${CIRC}`}
                  strokeDashoffset={orbitOffsets[active]}
                  transform="rotate(-90 240 240)"
                  style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1)' }}
                />

                {/* Step dots on circle */}
                <circle cx="240" cy="60" r="6" fill="black" opacity="0.4" />
                <circle cx="396" cy="330" r="6" fill="black" opacity="0.4" />
                <circle cx="84" cy="330" r="6" fill="black" opacity="0.4" />

                {/* Moving orbit dot */}
                {[0, 120, 240].map((deg, i) => {
                  const rad = ((deg - 90) * Math.PI) / 180
                  const cx = 240 + 180 * Math.cos(rad)
                  const cy = 240 + 180 * Math.sin(rad)
                  return i === active ? (
                    <g key={i}>
                      <circle cx={cx} cy={cy} r="14" fill="rgba(0,0,0,0.15)" />
                      <circle cx={cx} cy={cy} r="8" fill="black" />
                    </g>
                  ) : null
                })}
              </svg>

              {/* Step buttons positioned on the orbit */}
              {steps.map((s, i) => {
                const deg = i * 120
                const rad = ((deg - 90) * Math.PI) / 180
                const r = 48 // percent from center
                const cx = 50 + r * Math.cos(rad)
                const cy = 50 + r * Math.sin(rad)
                return (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    style={{ left: `${cx}%`, top: `${cy}%`, transform: 'translate(-50%, -50%)' }}
                    className={`absolute inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold border backdrop-blur-sm transition-all duration-300 whitespace-nowrap ${
                      active === i
                        ? 'bg-black text-white border-white/20 shadow-xl'
                        : 'bg-black/10 text-white/80 border-black/10 hover:bg-black/25'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <span>{s.title}</span>
                  </button>
                )
              })}

              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-16 pointer-events-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-white/50 text-[10px] mb-1 font-mono-brand">PHASE {step.number}</p>
                    <h3 className="font-grotesk text-xl font-medium text-white leading-tight">{step.title}</h3>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── Right: Detail Card ── */}
          <div className="flex-1 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
              >
                {/* Real photo background matching product context */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${step.bgImage})` }}
                />
                <div className="absolute inset-0 bg-black/75" />

                <div className="relative z-10 p-8 sm:p-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-orange rounded-2xl mb-6 text-white border border-white/10 shadow-lg">
                    {step.icon}
                  </div>

                  <p className="text-white/40 text-xs font-mono-brand mb-2">STEP {step.number}</p>
                  <h3 className="heading-md text-white mb-4">{step.title}</h3>
                  <p className="body-lg text-white/70 mb-8 text-base sm:text-lg leading-relaxed">
                    {step.description}
                  </p>

                  <ul className="space-y-3.5">
                    {step.highlights.map(h => (
                      <li key={h} className="flex items-center gap-3 text-white/80 text-sm font-light">
                        <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* Dot navigation */}
                  <div className="flex gap-2.5 mt-10">
                    {steps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          i === active ? 'bg-white w-8' : 'bg-white/30 w-4'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 flex items-center gap-5 justify-start pl-2"
            >
              <button
                onClick={() => {
                  document.getElementById('ride-finder')?.scrollIntoView({ behavior: 'smooth' })
                }}
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
