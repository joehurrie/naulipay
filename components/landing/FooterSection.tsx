'use client'

import { Zap, Twitter, Linkedin, Instagram, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

export default function FooterSection() {
  const currentYear = new Date().getFullYear()

  const links = {
    product: ['Find Rides', 'Tap-to-Pay', 'Loyalty Rewards', 'Micro-Credit'],
    company: ['About Us', 'Blog', 'Careers', 'Press'],
    support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'],
    dashboards: [
      { label: 'Commuter App', href: '/commuter' },
      { label: 'Fleet Owner', href: '/owner' },
      { label: 'Admin Panel', href: '/admin' },
    ],
  }

  return (
    <footer className="bg-black border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <Link href="/" className="flex items-center flex-shrink-0">
                <img
                  src="/logo.svg"
                  alt="Naulipay"
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed max-w-xs mb-6">
              East Africa&apos;s smartest urban transit payment platform. Book smarter, pay instantly, earn more.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-zinc-600 text-xs">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span>hello@naulipass.ke</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-600 text-xs">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>+254 800 NAULI (62854)</span>
              </div>
            </div>
            <div className="flex gap-2">
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-600 hover:text-brand-orange hover:bg-zinc-800 transition-all duration-200 border border-zinc-800 hover:border-zinc-700"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-white text-sm font-medium mb-5">Product</p>
            <ul className="space-y-3">
              {links.product.map(l => (
                <li key={l}>
                  <a href="#" className="text-zinc-600 text-sm hover:text-white transition-colors duration-200">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-white text-sm font-medium mb-5">Company</p>
            <ul className="space-y-3">
              {links.company.map(l => (
                <li key={l}>
                  <a href="#" className="text-zinc-600 text-sm hover:text-white transition-colors duration-200">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <p className="text-white text-sm font-medium mb-5">Dashboards</p>
            <ul className="space-y-3">
              {links.dashboards.map(l => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-zinc-600 text-sm hover:text-white transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-900 mt-14 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-700 text-xs">
            © {currentYear} Naulipay Ltd. All rights reserved. Registered in Kenya.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy', 'Terms', 'Cookies'].map(label => (
              <a key={label} href="#" className="text-zinc-700 text-xs hover:text-zinc-400 transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
