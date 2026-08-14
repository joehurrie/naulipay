'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Wallet, CreditCard, ArrowRight } from 'lucide-react'

const slides = [
  {
    id: 'reliability',
    label: 'Reliability',
    title: 'Never miss a ride',
    description: 'Get real-time alerts as your matatu approaches. Live GPS means zero guesswork — just show up and board.',
    icon: <Bell className="w-5 h-5" />,
    image: '/phone.jpg',
    accentColor: '#FF5F00',
  },
  {
    id: 'wallet',
    label: 'Payments',
    title: 'Instant transaction with your Naulipay wallet',
    description: 'Top up once, ride all day. Your Naulipay wallet balance deducts in milliseconds — no cash, no change, no friction.',
    icon: <Wallet className="w-5 h-5" />,
    image: '/car.jpg',
    accentColor: '#FF7A1A',
  },
  {
    id: 'nfc',
    label: 'NauliPass NFC',
    title: 'Tap pay go with your NauliPass NFC',
    description: 'Hold your NauliPass NFC card to any terminal. Board in under 2 seconds and you\'re already moving.',
    icon: <CreditCard className="w-5 h-5" />,
    image: '/band.jpg',
    accentColor: '#CC4A00',
  },
]

// Typing effect component
const TypingText = ({ text, initialDelay = 0.8 }: { text: string, initialDelay?: number }) => {
  return (
    <span className="inline-block">
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.05, delay: initialDelay + (index * 0.03) }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

export default function VehicleShowcaseSection() {
  const [active, setActive] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const slide = slides[active]

  return (
    <section
      id="value-props"
      className="relative min-h-screen flex flex-col overflow-hidden bg-zinc-950 border-b border-zinc-900/60"
    >
      {/* ── Animated photo banner — full bg (crossfade) ── */}
      {slides.map((s, index) => (
        <motion.div
          key={s.id}
          initial={false}
          animate={{
            opacity: active === index ? 1 : 0,
            scale: active === index ? 1 : 1.02
          }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${s.image})`,
            zIndex: active === index ? 1 : 0
          }}
        />
      ))}

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



              {/* Dynamic heading with typing effect */}
              <div className="mt-4">
                <h2 className="heading-lg text-white mb-4 min-h-[120px] sm:min-h-[90px]">
                  <TypingText key={`title-${active}`} text={slide.title} />
                </h2>
                <p className="text-zinc-400 text-base sm:text-lg font-light leading-relaxed mb-8 max-w-md">
                  {slide.description}
                </p>

                <a href="#track" className="btn-primary px-8 py-3.5 text-sm font-medium inline-flex items-center justify-center gap-2">
                  Track a Matatu
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Progress bar indicator ── */}
      <div className="relative z-10 flex-shrink-0 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            {slides.map((_, i) => (
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
                    transition={{ duration: 6, ease: 'linear' }}
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
