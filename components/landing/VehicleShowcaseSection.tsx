'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const slides = [
  {
    id: 'nfc',
    title: 'Tap pay go with your NauliPass NFC',
    description: 'Hold your NauliPass NFC card to any terminal. Board in under 2 seconds and you\'re already moving.',
    image: '/band.jpg',
  },
  {
    id: 'reliability',
    title: 'Never miss a ride',
    description: 'Get real-time alerts as your matatu approaches. Live GPS means zero guesswork — just show up and board.',
    image: '/phone.jpg',
  },
  {
    id: 'wallet',
    title: 'Instant transaction with your Naulipay wallet',
    description: 'Top up once, ride all day. Your Naulipay wallet balance deducts in milliseconds — no cash, no change, no friction.',
    image: '/car3.png',
  },
]

// Typewriter effect component with smooth letter-by-letter animation
const TypingText = ({ text, initialDelay = 0.15 }: { text: string, initialDelay?: number }) => {
  return (
    <span className="inline-block">
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.05, delay: initialDelay + (index * 0.025), ease: 'easeOut' }}
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
      className="relative min-h-[600px] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-white border-b border-zinc-200 py-12 sm:py-16"
    >
      {/* Navbar spacer */}
      <div className="h-8 sm:h-16 flex-shrink-0" />

      {/* ── Main Responsive Grid ── */}
      <div className="flex-1 flex items-center relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left: Text Content */}
            <div className="max-w-xl">
              {/* Section label */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="label-sm text-brand-orange mb-4 sm:mb-6"
              >
                Our fleet
              </motion.p>

              {/* Orange header text in smooth typewriter style */}
              <div>
                <h2 className="heading-lg text-brand-orange mb-4 min-h-[90px] sm:min-h-[100px]">
                  <TypingText key={`title-${active}`} text={slide.title} />
                </h2>

                {/* ── Mobile-Only Image Placement (Equal to Map Dimensions: h-[500px], rounded-3xl) ── */}
                <div className="block lg:hidden my-6 sm:my-8 relative w-full h-[500px] overflow-hidden  ">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={`mobile-${slide.id}`}
                      initial={{ x: '-100%', opacity: 0 }}
                      animate={{ x: '0%', opacity: 1 }}
                      exit={{ x: '100%', opacity: 0 }}
                      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 flex items-center justify-center p-0"
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover sm:object-cover border-none"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Paragraph in BLACK */}
                <p className="text-black font-normal text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-md">
                  {slide.description}
                </p>

                <a href="#track" className="btn-primary px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20">
                  Book a Ride
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Desktop-Only Right Column Image Box */}
            <div className="hidden lg:flex relative w-full h-[500px] items-center justify-center overflow-hidden  ">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={`desktop-${slide.id}`}
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={{ x: '0%', opacity: 1 }}
                  exit={{ x: '100%', opacity: 0 }}
                  transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex items-center justify-center p-0"
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>

      {/* ── Progress bar indicator ── */}
      <div className="relative z-10 flex-shrink-0 pt-6 sm:pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActive(i); setIsAutoPlaying(false) }}
                className="relative h-1 flex-1 bg-zinc-200 rounded-full overflow-hidden"
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
