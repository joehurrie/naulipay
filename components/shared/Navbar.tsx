'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavbarProps {
  transparent?: boolean
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isLanding = pathname === '/'

  const navBg = transparent && !scrolled && !mobileOpen
    ? 'bg-transparent'
    : 'bg-black/70 backdrop-blur-xl border-b border-zinc-900/60 shadow-2xl shadow-black/40'

  const navLinks = [
    { href: '/#fleet', label: 'Find Rides' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#loyalty', label: 'Loyalty' },
  ]

  const dashLinks = [
    { href: '/commuter', label: 'Commuter' },
    { href: '/owner', label: 'Fleet Owner' },
    { href: '/admin', label: 'Admin' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-7 h-7 bg-brand-orange rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-orange-500/30">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight font-grotesk">
              nauli<span className="text-brand-orange">pass</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {isLanding && navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link px-4 py-2 rounded-full hover:bg-white/5 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
            <div className="w-px h-5 bg-white/15 mx-3" />
            {dashLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-brand-orange bg-brand-orange/10'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button className="btn-ghost text-sm">Sign In</button>
            <button className="btn-primary text-sm">Get Started</button>
          </div>

          {/* Mobile Toggle */}
          <button
            id="nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className="block h-0.5 bg-white rounded-full transition-all duration-300 origin-center"
                style={{
                  transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                }}
              />
              <span
                className="block h-0.5 bg-white rounded-full transition-all duration-300"
                style={{ opacity: mobileOpen ? 0 : 1 }}
              />
              <span
                className="block h-0.5 bg-white rounded-full transition-all duration-300 origin-center"
                style={{
                  transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-zinc-900"
          >
            <div className="px-4 py-5 space-y-1">
              {isLanding && navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl text-sm font-medium transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-zinc-900 my-3" />
              <p className="px-4 text-xs text-zinc-600 uppercase tracking-wider mb-2 font-mono-brand">Dashboards</p>
              {dashLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl text-sm font-medium transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-zinc-900 pt-4 mt-3 flex flex-col gap-2">
                <button className="w-full btn-outline text-sm py-3">Sign In</button>
                <button className="w-full btn-primary text-sm py-3">Get Started</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
