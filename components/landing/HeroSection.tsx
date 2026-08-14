'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Shield, CreditCard, Wifi } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
})

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* ── Real Nairobi commuter/traffic photo ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(/inside1.jpg)',
        }}
      />

      {/* Cinematic dark overlay stack */}
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* ── Subtle grain texture ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-orange/6 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Navbar spacer ── */}
      <div className="h-16 flex-shrink-0" />

      {/* ── Center-aligned main content ── */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">

          {/* Live badge */}

          {/* Headline */}
          <motion.div {...fadeUp(0.1)} className="mb-8">
            <h1 className="heading-xl text-white mb-2">
              Convenient rides,
            </h1>
            {/* Orange highlight block — Kindling-style */}
            <div className="inline-flex justify-center">
              <div className="bg-brand-orange px-5 sm:px-7 py-1">
                <h1 className="heading-xl text-white">
                  seamless payments.
                </h1>
              </div>
            </div>
          </motion.div>

          {/* Sub-copy */}
          <motion.p
            {...fadeUp(0.2)}
            className="body-lg text-zinc-300 max-w-2xl mx-auto mb-10"
          >
            Book Matatus, Taxis, and Bodas across Nairobi with tap-to-pay NFC cards,
            real-time GPS tracking, and built-in loyalty rewards.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.3)}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
          >
            <a href="#ride-finder" className="btn-primary px-9 py-3.5 text-sm font-medium">
              Find a Ride
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#how-it-works" className="btn-outline px-9 py-3.5 text-sm font-medium">
              How It Works
            </a>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            {...fadeUp(0.4)}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-zinc-500"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-orange flex-shrink-0" />
              <span>Secure payments</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-orange flex-shrink-0" />
              <span>NauliPass Card</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-brand-orange flex-shrink-0" />
              <span>Live GPS tracking</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Key stats bar at bottom ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10 border-t border-white/10 flex-shrink-0"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {[
              { value: '2,450+', label: 'Rides completed' },
              { value: '24', label: 'Active vehicles' },
              { value: 'KES 70', label: 'Avg matatu fare' },
            ].map(stat => (
              <div key={stat.label} className="text-center px-4 sm:px-8">
                <div className="text-xl sm:text-2xl font-semibold text-white font-grotesk">{stat.value}</div>
                <div className="text-xs sm:text-sm text-zinc-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Scroll hint — sits above the stats bar with breathing room ── */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-5 h-8 border border-zinc-700 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-brand-orange rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
