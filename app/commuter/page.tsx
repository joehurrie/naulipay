'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wallet, MapPin, Star, CreditCard, TrendingUp, Clock,
  CheckCircle, XCircle, ChevronRight, Plus, Bell, LayoutDashboard,
  History, Settings, LogOut, Navigation, Zap, Share2, ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { mockTrips, currentUser, fareEstimates, vehicleEmojis, vehicleLabels, type VehicleType } from '@/lib/mock-data'
import { formatCurrency, formatDate, calculateCreditProgress, getInitials } from '@/lib/utils'

type Tab = 'overview' | 'trips' | 'wallet' | 'book'

export default function CommuterDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [selectedRideType, setSelectedRideType] = useState<VehicleType>('matatu')

  const completedTrips = mockTrips.filter(t => t.status === 'completed')
  const activeTrip = mockTrips.find(t => t.status === 'active')
  const creditProgress = calculateCreditProgress(currentUser.totalTrips)
  const totalEarned = completedTrips.reduce((s, t) => s + t.points, 0)

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'trips', label: 'Trip History', icon: <History className="w-4 h-4" /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet className="w-4 h-4" /> },
    { id: 'book', label: 'Book Ride', icon: <Navigation className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-brand-neutral flex">

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed h-full">
        <div className="p-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-orange rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-brand-charcoal font-bold text-lg">nauli<span className="text-brand-orange">pass</span></span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-orange text-white rounded-xl flex items-center justify-center font-bold text-sm">
              {getInitials(currentUser.name)}
            </div>
            <div>
              <p className="font-semibold text-brand-charcoal text-sm">{currentUser.name}</p>
              <p className="text-gray-400 text-xs">{currentUser.id}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-nav-item w-full ${activeTab === item.id ? 'sidebar-nav-active' : 'sidebar-nav-inactive'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom links */}
        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link href="/owner" className="sidebar-nav-item sidebar-nav-inactive w-full">
            <TrendingUp className="w-4 h-4" /> Owner Portal
          </Link>
          <Link href="/admin" className="sidebar-nav-item sidebar-nav-inactive w-full">
            <Settings className="w-4 h-4" /> Admin
          </Link>
          <Link href="/" className="sidebar-nav-item sidebar-nav-inactive w-full">
            <LogOut className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-brand-charcoal text-lg">
                {navItems.find(n => n.id === activeTab)?.label}
              </h1>
              <p className="text-gray-400 text-xs">Thursday, Aug 14 · Nairobi</p>
            </div>
            <div className="flex items-center gap-3">
              <button id="notif-btn" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full" />
              </button>
              <div className="w-8 h-8 bg-brand-orange text-white rounded-xl flex items-center justify-center font-bold text-xs">
                {getInitials(currentUser.name)}
              </div>
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="lg:hidden flex gap-2 mt-3 overflow-x-auto no-scrollbar">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === item.id ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Active Trip Banner */}
                {activeTrip && (
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="bg-brand-charcoal rounded-2xl p-5 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-brand-orange/10 rounded-full blur-2xl" />
                    <div className="flex items-start justify-between relative">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
                          <span className="text-brand-orange text-xs font-semibold uppercase tracking-wider">Trip In Progress</span>
                        </div>
                        <p className="text-white font-bold text-lg">{vehicleEmojis[activeTrip.vehicleType]} {activeTrip.from} → {activeTrip.to}</p>
                        <p className="text-white/50 text-sm mt-1">Driver: {activeTrip.driver} · {activeTrip.plate}</p>
                      </div>
                      <button id="share-trip-btn" className="flex items-center gap-1.5 bg-brand-orange text-white px-3 py-1.5 rounded-xl text-xs font-medium">
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </button>
                    </div>
                    <div className="mt-4 flex gap-4">
                      <div className="bg-white/5 rounded-xl px-3 py-2">
                        <p className="text-white/40 text-xs">Est. Fare</p>
                        <p className="text-white font-bold">{formatCurrency(activeTrip.fare)}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl px-3 py-2">
                        <p className="text-white/40 text-xs">Duration</p>
                        <p className="text-white font-bold">{activeTrip.duration}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Stat Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Wallet Balance', value: formatCurrency(currentUser.walletBalance), icon: <Wallet className="w-4 h-4 text-brand-orange" />, sub: 'Available' },
                    { label: 'Loyalty Points', value: currentUser.loyaltyPoints.toLocaleString(), icon: <Star className="w-4 h-4 text-yellow-500" />, sub: `≈ ${formatCurrency(currentUser.loyaltyPoints / 10)}` },
                    { label: 'Total Trips', value: currentUser.totalTrips, icon: <Navigation className="w-4 h-4 text-blue-500" />, sub: 'Completed' },
                    { label: 'NFC Card', value: 'Active', icon: <CreditCard className="w-4 h-4 text-emerald-500" />, sub: currentUser.cardId },
                  ].map((item, i) => (
                    <motion.div key={item.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="stat-card">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <div className="bg-gray-50 p-1.5 rounded-lg">{item.icon}</div>
                      </div>
                      <p className="text-xl font-bold text-brand-charcoal">{item.value}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Credit Progress */}
                <div className="card-white p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-brand-charcoal">Micro-Credit Eligibility</h3>
                      <p className="text-sm text-gray-400 mt-0.5">{currentUser.totalTrips} / 50 verified trips</p>
                    </div>
                    <span className="badge bg-orange-100 text-orange-700 text-xs px-3 py-1">
                      {50 - currentUser.totalTrips} trips away
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${creditProgress}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-brand-orange to-brand-orange-light rounded-full"
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                    <span>0 trips</span>
                    <span className="text-brand-orange font-medium">{creditProgress.toFixed(0)}%</span>
                    <span>50 trips</span>
                  </div>
                </div>

                {/* Recent Trips */}
                <div className="card-white p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-brand-charcoal">Recent Trips</h3>
                    <button onClick={() => setActiveTab('trips')} className="text-brand-orange text-sm font-medium flex items-center gap-1">
                      View all <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {mockTrips.filter(t => t.status !== 'active').slice(0, 3).map(trip => (
                      <div key={trip.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="text-2xl">{vehicleEmojis[trip.vehicleType]}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-brand-charcoal text-sm truncate">{trip.from} → {trip.to}</p>
                          <p className="text-xs text-gray-400">{formatDate(trip.date)} · {vehicleLabels[trip.vehicleType]}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-brand-charcoal text-sm">{formatCurrency(trip.fare)}</p>
                          <p className="text-xs text-yellow-600">+{trip.points} pts</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'trips' && (
              <motion.div key="trips" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="card-white overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-brand-charcoal">All Trips</h3>
                    <p className="text-gray-400 text-sm">{mockTrips.length} total journeys</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {mockTrips.map(trip => (
                      <div key={trip.id} className="flex items-center gap-4 px-5 py-4 table-row-hover">
                        <div className="text-2xl w-10 text-center">{vehicleEmojis[trip.vehicleType]}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-brand-charcoal text-sm">{trip.from} → {trip.to}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatDate(trip.date)} · {trip.driver} · {trip.plate}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm text-gray-500">{trip.duration}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-brand-charcoal">{formatCurrency(trip.fare)}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            {trip.status === 'completed' && <span className="badge-success">Completed</span>}
                            {trip.status === 'active' && <span className="badge-info">Active</span>}
                            {trip.status === 'cancelled' && <span className="badge-error">Cancelled</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'wallet' && (
              <motion.div key="wallet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                {/* Balance Card */}
                <div className="bg-brand-charcoal rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/10 rounded-full blur-3xl" />
                  <p className="text-white/60 text-sm mb-1">Available Balance</p>
                  <p className="text-white text-5xl font-black mb-2">{formatCurrency(currentUser.walletBalance)}</p>
                  <p className="text-white/40 text-xs mb-6">{currentUser.cardId} · NFC Active</p>
                  <div className="flex gap-3">
                    <button id="top-up-btn" className="btn-primary flex items-center gap-2 py-2.5 text-sm">
                      <Plus className="w-4 h-4" /> Top Up
                    </button>
                    <button id="send-btn" className="btn-secondary flex items-center gap-2 py-2.5 text-sm">
                      <ArrowRight className="w-4 h-4" /> Send
                    </button>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="card-white p-5">
                  <h3 className="font-semibold text-brand-charcoal mb-4">Payment Methods</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'NFC Naulipass Card', sub: currentUser.cardId, icon: '💳', active: true },
                      { label: 'M-Pesa', sub: currentUser.phone, icon: '📱', active: true },
                      { label: 'Visa Debit', sub: '•••• 4821', icon: '🏦', active: false },
                    ].map(method => (
                      <div key={method.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <span className="text-2xl">{method.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium text-brand-charcoal text-sm">{method.label}</p>
                          <p className="text-gray-400 text-xs">{method.sub}</p>
                        </div>
                        {method.active
                          ? <span className="badge-success text-xs">Active</span>
                          : <span className="badge text-xs bg-gray-100 text-gray-400">Inactive</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'book' && (
              <motion.div key="book" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="card-white p-6">
                  <h3 className="font-bold text-brand-charcoal text-xl mb-5">Book a Ride</h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">From</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-orange" />
                        <input className="input-light pl-10" placeholder="Current location" defaultValue="Westlands, Nairobi" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">To</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input className="input-light pl-10" placeholder="Where are you going?" />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Selection */}
                  <p className="text-sm font-medium text-gray-700 mb-3">Choose vehicle type</p>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {(['matatu', 'taxi', 'boda'] as VehicleType[]).map(v => (
                      <button
                        key={v}
                        id={`book-${v}`}
                        onClick={() => setSelectedRideType(v)}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                          selectedRideType === v
                            ? 'border-brand-orange bg-brand-orange/5'
                            : 'border-gray-200 hover:border-brand-orange/40'
                        }`}
                      >
                        <div className="text-3xl mb-1">{vehicleEmojis[v]}</div>
                        <div className="font-semibold text-brand-charcoal text-sm capitalize">{vehicleLabels[v]}</div>
                        <div className="text-brand-orange font-bold text-sm">KES {fareEstimates[v].base}</div>
                      </button>
                    ))}
                  </div>

                  {/* Fare Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 text-sm">Base Fare</span>
                      <span className="font-semibold">KES {fareEstimates[selectedRideType].base}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 text-sm">Est. Time</span>
                      <span className="font-semibold">{fareEstimates[selectedRideType].time}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 text-sm">Payment</span>
                      <span className="font-semibold flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-brand-orange" />NFC Card</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                      <span className="font-semibold text-brand-charcoal">Loyalty Points</span>
                      <span className="text-yellow-600 font-semibold">+{fareEstimates[selectedRideType].base * 0.2} pts</span>
                    </div>
                  </div>

                  <button id="confirm-booking-btn" className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Confirm Booking
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
