'use client'

import { motion } from 'framer-motion'
import { Star, TrendingUp, Landmark, Gift, ChevronRight } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
})

export default function LoyaltySection() {
  const tripProgress = 37
  const creditThreshold = 50
  const progressPercent = (tripProgress / creditThreshold) * 100

  const perks = [
    { icon: <Star className="w-5 h-5" />, title: 'Points Per Trip', desc: 'Earn up to 20% of fare value back as loyalty points on every ride' },
    { icon: <Gift className="w-5 h-5" />, title: 'Redeem Rewards', desc: 'Use points for free rides, fare discounts, or transfer to in-app wallet' },
    { icon: <Landmark className="w-5 h-5" />, title: 'Micro-Credit Access', desc: 'Complete 50 verified trips to unlock emergency credit up to KES 10,000' },
    { icon: <TrendingUp className="w-5 h-5" />, title: 'Credit Scoring', desc: 'Build a verified transit credit score that unlocks better financial services' },
  ]

  return (
    <section id="loyalty" className="bg-black border-b border-zinc-900/60 relative overflow-hidden min-h-screen flex flex-col justify-center py-24">
      {/* Background commuter photo */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'url(/Desktop%20-%209.jpg)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-zinc-950" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Copy + Perks ── */}
          <motion.div {...fadeUp(0)}>
            <p className="label-sm text-brand-orange mb-4">Rewards & Credit</p>
            <h2 className="heading-lg text-white mb-6">
              Every ride builds<br />
              your financial future
            </h2>
            <p className="body-lg text-zinc-400 mb-10 max-w-md">
              Naulipay isn&apos;t just a transit app — it&apos;s your gateway to financial inclusion.
              Earn loyalty points on every trip and unlock micro-credit services as you ride more.
            </p>

            <div className="space-y-4">
              {perks.map((perk, i) => (
                <motion.div
                  key={perk.title}
                  {...fadeUp(i * 0.08 + 0.1)}
                  className="flex items-start gap-4 p-4 border border-zinc-900 bg-zinc-950/40 rounded-2xl hover:border-zinc-800 hover:bg-white/2 transition-all duration-300 group"
                >
                  <div className="bg-brand-orange/10 text-brand-orange p-2.5 rounded-xl group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 flex-shrink-0">
                    {perk.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm mb-1">{perk.title}</div>
                    <div className="text-zinc-500 text-xs leading-relaxed font-light">{perk.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Progress & Balance Cards ── */}
          <motion.div {...fadeUp(0.15)} className="space-y-6">

            {/* Credit Unlock Card */}
            <div className="card-dark rounded-3xl p-8 bg-zinc-950/90 border-zinc-850 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-zinc-500 text-sm">Micro-Credit Status</p>
                  <p className="text-white font-bold text-xl mt-0.5 font-grotesk">
                    {tripProgress} / {creditThreshold} trips completed
                  </p>
                </div>
                <div className="bg-brand-orange/15 border border-brand-orange/25 rounded-xl px-3 py-1.5 flex-shrink-0">
                  <span className="text-brand-orange text-sm font-semibold">
                    {creditThreshold - tripProgress} to unlock
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-zinc-500 mb-2">
                  <span>Credit Eligibility Progress</span>
                  <span className="font-medium text-white">{progressPercent.toFixed(0)}%</span>
                </div>
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-zinc-800">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progressPercent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-brand-orange to-brand-orange-light rounded-full relative"
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-brand-orange/50" />
                  </motion.div>
                </div>
                <div className="flex justify-between mt-2 font-mono-brand">
                  {[0, 10, 25, 50].map(m => (
                    <div key={m} className="text-center">
                      <div className={`text-[10px] ${m <= tripProgress ? 'text-brand-orange font-semibold' : 'text-zinc-700'}`}>{m} trips</div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-zinc-650 text-xs mt-4">
                Complete {creditThreshold - tripProgress} more verified trips to unlock up to{' '}
                <span className="text-brand-orange font-medium">KES 10,000</span> in emergency micro-credit.
              </p>
            </div>

            {/* Points Balance Card */}
            <div className="card-dark rounded-3xl p-8 bg-zinc-950/90 border-zinc-850 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-zinc-500 text-sm">Loyalty Points Balance</p>
                  <p className="text-3xl font-bold text-white mt-1 font-grotesk">1,847 pts</p>
                </div>
                {/* Minimalist non-cartoonish star icon */}
                <div className="w-12 h-12 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl flex items-center justify-center text-brand-orange">
                  <Star className="w-6 h-6" fill="currentColor" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Earned This week', value: '+240' },
                  { label: 'Redeemed Total', value: '500' },
                  { label: 'Cash Equivalent', value: 'KES 184' },
                ].map(item => (
                  <div key={item.label} className="bg-white/5 border border-zinc-800/80 rounded-xl p-3 text-center">
                    <div className="text-white font-bold text-sm">{item.value}</div>
                    <div className="text-zinc-500 text-[10px] mt-1 font-light leading-tight">{item.label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => alert('Loyalty redemption features are managed in the Naulipay commuter dashboard')}
                className="w-full mt-6 flex items-center justify-center gap-2 text-brand-orange text-sm font-semibold hover:gap-3 transition-all duration-200 py-3 border border-brand-orange/20 rounded-xl hover:bg-brand-orange/5"
              >
                Redeem Points to Wallet <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
