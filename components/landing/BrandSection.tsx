'use client'

import { motion } from 'framer-motion'

export default function BrandSection() {
  return (
    <section className="relative overflow-hidden bg-black" style={{ minHeight: '360px' }}>

      {/* ── Background: city traffic image at low opacity ── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/Desktop%20-%205.jpg)' }}
      />
      {/* Dark vignette — heavier on edges, lighter in centre so text glows through */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />

      {/* ── Noise texture ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
        }}
      />

      {/* ── Glow bloom behind the text ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="rounded-full blur-[120px] opacity-20"
          style={{ width: '70%', height: '200px', background: 'radial-gradient(ellipse, #FF5F00 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Main text ── */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full py-16 px-4 text-center">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[11px] font-mono-brand text-brand-orange uppercase tracking-[0.35em] mb-4"
        >
          East Africa&apos;s Transit Platform
        </motion.p>

        {/* NAULIPAY — clipped gradient with subtle image mix-in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Shadow / glow layer */}
          <span
            aria-hidden="true"
            className="absolute inset-0 font-grotesk font-black leading-none tracking-tighter select-none"
            style={{
              fontSize: 'clamp(72px, 12vw, 180px)',
              WebkitTextStroke: '1px rgba(255,95,0,0.18)',
              color: 'transparent',
              filter: 'blur(12px)',
              opacity: 0.8,
            }}
          >
            NAULIPAY
          </span>

          {/* Primary text */}
          <h2
            className="relative font-grotesk font-black leading-none tracking-tighter"
            style={{
              fontSize: 'clamp(72px, 12vw, 180px)',
              background: 'linear-gradient(135deg, #ffffff 0%, #FF8C33 35%, #FF5F00 55%, #ffffff 80%, #FF5F00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 200%',
            }}
          >
            NAULIPAY
          </h2>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-zinc-500 text-sm mt-6 tracking-wide max-w-sm"
        >
          Convenient rides. Seamless payments. Every journey.
        </motion.p>

        {/* Divider dots */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center gap-2 mt-5"
        >
          <div className="w-1 h-1 rounded-full bg-brand-orange" />
          <div className="w-12 h-px bg-zinc-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-orange/60" />
          <div className="w-12 h-px bg-zinc-800" />
          <div className="w-1 h-1 rounded-full bg-brand-orange" />
        </motion.div>
      </div>
    </section>
  )
}
