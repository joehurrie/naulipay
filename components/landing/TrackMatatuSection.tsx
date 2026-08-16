'use client'

import { motion } from 'framer-motion'
import { MapPin, ArrowRight, Star, Radio } from 'lucide-react'
import Link from 'next/link'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
})

export default function TrackMatatuSection() {
  return (
    <section id="track" className="relative bg-black py-24 overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/4 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp(0)} className="flex flex-col gap-6">
            <span className="label-sm text-brand-orange">Never Miss Your Ride</span>
            <h2 className="heading-lg text-white">Track your favorite matatu</h2>
            <p className="body-lg text-zinc-400 max-w-md">
              Search any matatu by its plate number, save the ones you ride often, and check
              their last known status right from your NauliPay account.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              {[
                {
                  icon: <MapPin className="w-4 h-4" />,
                  title: 'Search by plate',
                  desc: 'Find a specific matatu instantly — no need to guess its route.',
                },
                {
                  icon: <Star className="w-4 h-4" />,
                  title: 'Save your favorites',
                  desc: 'Keep a personal list of matatus you ride regularly.',
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

            <Link href="/login" className="btn-primary w-fit py-3.5 px-6 text-sm font-semibold">
              Sign in to start tracking <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="card-dark border-zinc-800 bg-zinc-950/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <Radio className="w-7 h-7" />
            </div>
            <h3 className="font-grotesk text-xl font-medium text-white">Live status, once you&apos;re signed in</h3>
            <p className="text-zinc-500 text-sm max-w-xs">
              Tracking is part of your NauliPay account — sign in (or create one) to search for a
              matatu and start following it.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
