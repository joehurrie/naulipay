'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wallet, MapPin, Star, CreditCard, Clock,
  CheckCircle, XCircle, ChevronRight, Plus, Bell, LayoutDashboard,
  History, LogOut, Navigation, Zap, Share2,
  AlertTriangle, Loader2
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { useRequireRole } from '@/lib/require-role'
import {
  favoritesApi, loyaltyApi, notificationsApi, transactionsApi, tripsApi, vehiclesApi, walletApi
} from '@/lib/api'
import {
  currentUser as mockUser, mockTrips, vehicleEmojis, vehicleLabels
} from '@/lib/mock-data'
import {
  formatCurrency, formatDate, formatDateTime, calculateCreditProgress, getInitials,
  tripStatusColor, transactionStatusColor, vehicleStatusColor
} from '@/lib/utils'
import type { FavoriteVehicleOut, NotificationOut, TransactionOut, TripOut, VehicleOut } from '@/lib/types'

type Tab = 'overview' | 'trips' | 'wallet' | 'track'

export default function CommuterDashboard() {
  const { user, logout } = useAuth()
  const { isReady } = useRequireRole('commuter')
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  // Live data
  const [wallet, setWallet] = useState<{ balance: string; currency: string }>({ balance: '2340', currency: 'KES' })
  const [loyalty, setLoyalty] = useState<{ points_balance: number; completed_trip_count: number; is_credit_eligible: boolean } | null>(null)
  const [trips, setTrips] = useState<TripOut[]>([])
  const [localTrips, setLocalTrips] = useState<TripOut[]>([])
  const [transactions, setTransactions] = useState<TransactionOut[]>([])
  const [notifications, setNotifications] = useState<NotificationOut[]>([])
  const [favorites, setFavorites] = useState<FavoriteVehicleOut[]>([])

  // UI state
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  // Forms
  const [topupAmount, setTopupAmount] = useState('')
  const [topupStatus, setTopupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [topupMsg, setTopupMsg] = useState('')

  const [plateQuery, setPlateQuery] = useState('')
  const [searchResult, setSearchResult] = useState<VehicleOut | null>(null)
  const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'not_found' | 'error'>('idle')

  const displayName = user?.full_name || user?.phone_number || mockUser.name

  const loadLocalTrips = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('naulipass_user_trips') || '[]')
      if (Array.isArray(stored) && stored.length > 0) {
        const formatted = stored.map((st: any) => ({
          id: st.id || `T-${Math.floor(Math.random() * 10000)}`,
          commuter_id: user?.id || 'USR-8821',
          vehicle_id: null,
          category: st.category || st.vehicleType || 'matatu',
          status: st.status || 'completed',
          pickup_lat: 0,
          pickup_lng: 0,
          dropoff_lat: null,
          dropoff_lng: null,
          share_link_token: '',
          requested_at: st.requested_at || st.date || new Date().toISOString(),
          fare_estimate: st.fare_estimate || { estimated_total: st.fare || 100 }
        } as unknown as TripOut))
        setLocalTrips(formatted)
      }
    } catch {}
  }

  const load = async (key: string, fn: () => Promise<void>) => {
    setLoading((p) => ({ ...p, [key]: true }))
    try { await fn() } catch (err) { console.error(err) }
    setLoading((p) => ({ ...p, [key]: false }))
  }

  useEffect(() => {
    loadLocalTrips()
    const handleSync = () => loadLocalTrips()
    window.addEventListener('naulipass_trip_added', handleSync)

    load('initial', async () => {
      try {
        const [w, l, t, tx, n] = await Promise.all([
          walletApi.me(),
          loyaltyApi.get(),
          tripsApi.list(),
          transactionsApi.list(),
          notificationsApi.list(),
        ])
        if (w && parseFloat(w.balance) > 0) {
          setWallet(w)
        }
        setLoyalty(l)
        setTrips(t)
        setTransactions(tx)
        setNotifications(n)
      } catch (err) {
        setError('Some live data could not be loaded. Using demo data where available.')
      }
    })

    load('favorites', async () => {
      try {
        setFavorites(await favoritesApi.list())
      } catch { /* ignore */ }
    })

    return () => {
      window.removeEventListener('naulipass_trip_added', handleSync)
    }
  }, [])

  const activeTrip = useMemo(() => trips.find((t) => t.status === 'in_progress'), [trips])
  const completedTrips = useMemo(() => trips.filter((t) => t.status === 'completed'), [trips])
  const totalPoints = loyalty?.points_balance ?? 0
  const totalTrips = loyalty?.completed_trip_count ?? completedTrips.length
  const creditProgress = calculateCreditProgress(totalTrips)

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault()
    setTopupStatus('loading')
    try {
      const res = await walletApi.topup({ amount: parseFloat(topupAmount) })
      setTopupStatus('success')
      setTopupMsg(`Top-up initiated: ${res.checkout_request_id || res.id}. Check your phone to complete M-Pesa payment.`)
      const w = await walletApi.me()
      setWallet(w)
    } catch (err) {
      setTopupStatus('error')
      setTopupMsg(err instanceof Error ? err.message : 'Top-up failed')
    }
  }

  const handleSearchVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!plateQuery.trim()) return
    setSearchStatus('loading')
    setSearchResult(null)
    try {
      const results = await vehiclesApi.list(plateQuery.trim())
      if (results.length === 0) {
        setSearchStatus('not_found')
      } else {
        setSearchResult(results[0])
        setSearchStatus('idle')
      }
    } catch {
      setSearchStatus('error')
    }
  }

  const handleFavorite = async (vehicleId: string) => {
    try {
      await vehiclesApi.favorite(vehicleId)
      setFavorites(await favoritesApi.list())
    } catch (err) {
      console.error(err)
    }
  }

  const handleUnfavorite = async (vehicleId: string) => {
    try {
      await vehiclesApi.unfavorite(vehicleId)
      setFavorites((prev) => prev.filter((f) => f.vehicle_id !== vehicleId))
    } catch (err) {
      console.error(err)
    }
  }

  const handleShare = async (trip: TripOut) => {
    try {
      const { share_url } = await tripsApi.shareLink(trip.id)
      if (navigator.share) {
        await navigator.share({ title: 'My Naulipass trip', url: share_url })
      } else {
        await navigator.clipboard.writeText(share_url)
        alert('Trip link copied to clipboard!')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const markRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status: 'sent' as const } : n)))
    } catch { /* ignore */ }
  }

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'trips', label: 'Previous Trips', icon: <History className="w-4 h-4" /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet className="w-4 h-4" /> },
    { id: 'track', label: 'Track Matatu', icon: <MapPin className="w-4 h-4" /> },
  ]

  const baseTrips = useMemo(() => {
    return trips.length > 0
      ? trips
      : mockTrips.map(
          (t) =>
            ({
              ...t,
              id: t.id,
              commuter_id: user?.id || '',
              vehicle_id: null,
              category: t.vehicleType,
              status: t.status as any,
              pickup_lat: 0,
              pickup_lng: 0,
              dropoff_lat: null,
              dropoff_lng: null,
              share_link_token: '',
              requested_at: t.date,
              fare_estimate: { estimated_total: t.fare },
            } as unknown as TripOut)
        )
  }, [trips, user?.id])

  const displayedTrips = useMemo(() => {
    const existingIds = new Set(baseTrips.map((t) => t.id))
    const uniqueLocal = localTrips.filter((lt) => !existingIds.has(lt.id))
    return [...uniqueLocal, ...baseTrips]
  }, [baseTrips, localTrips])

  if (!isReady) return null

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

        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-orange text-white rounded-xl flex items-center justify-center font-bold text-sm">
              {getInitials(displayName)}
            </div>
            <div>
              <p className="font-semibold text-brand-charcoal text-sm">{displayName}</p>
              <p className="text-gray-400 text-xs">{user?.phone_number || mockUser.phone}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
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

        <div className="p-4 border-t border-gray-100 space-y-1">
          <button onClick={logout} className="sidebar-nav-item sidebar-nav-inactive w-full text-left">
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-brand-charcoal text-lg">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h1>
              <p className="text-gray-400 text-xs">{formatDate(new Date().toISOString())} · Nairobi</p>
            </div>
            <div className="flex items-center gap-3">
              <button id="notif-btn" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-500" />
                {notifications.some((n) => n.status === 'queued') && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full" />
                )}
              </button>
              <div className="w-8 h-8 bg-brand-orange text-white rounded-xl flex items-center justify-center font-bold text-xs">
                {getInitials(displayName)}
              </div>
            </div>
          </div>

          <div className="lg:hidden flex gap-2 mt-3 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
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

        {error && (
          <div className="bg-amber-50 text-amber-700 px-6 py-3 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto font-medium hover:underline">Dismiss</button>
          </div>
        )}

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
                        <p className="text-white font-bold text-lg">{vehicleEmojis[activeTrip.category]} On the way</p>
                        <p className="text-white/50 text-sm mt-1">Trip #{activeTrip.id.slice(0, 8)} · {activeTrip.category}</p>
                      </div>
                      <button
                        onClick={() => handleShare(activeTrip)}
                        className="flex items-center gap-1.5 bg-brand-orange text-white px-3 py-1.5 rounded-xl text-xs font-medium"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </button>
                    </div>
                    <div className="mt-4 flex gap-4">
                      <div className="bg-white/5 rounded-xl px-3 py-2">
                        <p className="text-white/40 text-xs">Est. Fare</p>
                        <p className="text-white font-bold">
                          {formatCurrency(activeTrip.fare_estimate?.estimated_total || 0)}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl px-3 py-2">
                        <p className="text-white/40 text-xs">Status</p>
                        <p className="text-white font-bold capitalize">{activeTrip.status.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Wallet Balance', value: formatCurrency(wallet?.balance || '2340'), icon: <Wallet className="w-4 h-4 text-brand-orange" />, sub: 'Available' },
                    { label: 'Loyalty Points', value: totalPoints.toLocaleString(), icon: <Star className="w-4 h-4 text-yellow-500" />, sub: `≈ ${formatCurrency(totalPoints / 10)}` },
                    { label: 'Total Trips', value: totalTrips.toString(), icon: <Navigation className="w-4 h-4 text-blue-500" />, sub: 'Completed' },
                    { label: 'NFC Card', value: 'Active', icon: <CreditCard className="w-4 h-4 text-emerald-500" />, sub: user?.id ? 'Linked' : 'Demo' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="stat-card"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <div className="bg-gray-50 p-1.5 rounded-lg">{item.icon}</div>
                      </div>
                      <p className="text-xl font-bold text-brand-charcoal">{item.value}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="card-white p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-brand-charcoal">Micro-Credit Eligibility</h3>
                      <p className="text-sm text-gray-400 mt-0.5">{totalTrips} / 50 verified trips</p>
                    </div>
                    <span className="badge bg-orange-100 text-orange-700 text-xs px-3 py-1">
                      {Math.max(0, 50 - totalTrips)} trips away
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

                <div className="card-white p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-brand-charcoal">Recent Trips</h3>
                    <button onClick={() => setActiveTab('trips')} className="text-brand-orange text-sm font-medium flex items-center gap-1">
                      View all <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {displayedTrips.slice(0, 3).map((trip) => (
                      <div key={trip.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="text-2xl">{vehicleEmojis[trip.category]}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-brand-charcoal text-sm truncate">
                            Trip #{trip.id.slice(0, 8)} · {vehicleLabels[trip.category]}
                          </p>
                          <p className="text-xs text-gray-400">{formatDateTime(trip.requested_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-brand-charcoal text-sm">
                            {formatCurrency(trip.fare_estimate?.estimated_total || 0)}
                          </p>
                          <span className={`text-xs ${tripStatusColor[trip.status]}`}>{trip.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                    ))}
                    {displayedTrips.length === 0 && <p className="text-sm text-gray-400">No trips yet.</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'trips' && (
              <motion.div key="trips" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="card-white overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-brand-charcoal">All Trips</h3>
                    <p className="text-gray-400 text-sm">{displayedTrips.length} total journeys</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {displayedTrips.map((trip) => (
                      <div key={trip.id} className="flex items-center gap-4 px-5 py-4 table-row-hover">
                        <div className="text-2xl w-10 text-center">{vehicleEmojis[trip.category]}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-brand-charcoal text-sm">Trip #{trip.id.slice(0, 8)}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(trip.requested_at)} · {vehicleLabels[trip.category]}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                          {trip.status === 'searching' && <Clock className="w-4 h-4 text-amber-500" />}
                          {trip.status === 'completed' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                          {trip.status === 'cancelled' && <XCircle className="w-4 h-4 text-red-500" />}
                          <span className={`text-xs ${tripStatusColor[trip.status]} capitalize`}>{trip.status.replace('_', ' ')}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-brand-charcoal text-sm">{formatCurrency(trip.fare_estimate?.estimated_total || 0)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'wallet' && (
              <motion.div key="wallet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="card-white p-6">
                  <p className="text-gray-500 text-sm mb-1">Available balance</p>
                  <p className="text-4xl font-black text-brand-charcoal">{formatCurrency(wallet?.balance || '2340')}</p>
                  <p className="text-xs text-gray-400 mt-1">Currency: {wallet?.currency || 'KES'}</p>
                </div>

                <div className="card-white p-6">
                  <h3 className="font-semibold text-brand-charcoal mb-4">Top Up Wallet</h3>
                  <form onSubmit={handleTopup} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Amount (KES)</label>
                      <div className="relative">
                        <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          min={10}
                          value={topupAmount}
                          onChange={(e) => setTopupAmount(e.target.value)}
                          placeholder="500"
                          className="input-light pl-12"
                          required
                        />
                      </div>
                    </div>

                    {topupStatus === 'success' && (
                      <div className="text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl text-sm">{topupMsg}</div>
                    )}
                    {topupStatus === 'error' && (
                      <div className="text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm">{topupMsg}</div>
                    )}

                    <button
                      type="submit"
                      disabled={topupStatus === 'loading'}
                      className="w-full btn-primary py-3 disabled:opacity-60"
                    >
                      {topupStatus === 'loading' ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                      ) : (
                        <><Plus className="w-4 h-4" /> Top Up via M-Pesa</>
                      )}
                    </button>
                  </form>
                </div>

                <div className="card-white overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-brand-charcoal">Transactions</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">ID</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Method</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Amount</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {transactions.slice(0, 5).map((tx) => (
                          <tr key={tx.id} className="table-row-hover">
                            <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{tx.id.slice(0, 8)}</td>
                            <td className="px-5 py-3.5 text-gray-600 text-xs capitalize">{tx.method.replace('_', ' ')}</td>
                            <td className="px-5 py-3.5 font-bold text-brand-charcoal">{formatCurrency(tx.total_amount)}</td>
                            <td className="px-5 py-3.5"><span className={`text-xs ${transactionStatusColor[tx.status]}`}>{tx.status}</span></td>
                          </tr>
                        ))}
                        {transactions.length === 0 && (
                          <tr><td colSpan={4} className="px-5 py-6 text-sm text-gray-400 text-center">No transactions yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'track' && (
              <motion.div key="track" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="card-white p-6">
                  <h3 className="font-semibold text-brand-charcoal mb-1">Find a matatu</h3>
                  <p className="text-gray-400 text-sm mb-5">Search by plate number to check its status and save it as a favorite.</p>
                  <form onSubmit={handleSearchVehicle} className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={plateQuery}
                        onChange={(e) => setPlateQuery(e.target.value)}
                        placeholder="e.g. KDA 123X"
                        className="input-light pl-11"
                      />
                    </div>
                    <button type="submit" disabled={searchStatus === 'loading'} className="btn-primary px-5 disabled:opacity-60">
                      {searchStatus === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Find'}
                    </button>
                  </form>

                  {searchStatus === 'not_found' && (
                    <p className="text-sm text-gray-400 mt-4">No matatu found with that plate number.</p>
                  )}
                  {searchStatus === 'error' && (
                    <p className="text-sm text-red-500 mt-4">Search failed. Please try again.</p>
                  )}

                  {searchResult && (
                    <div className="mt-5 flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <span className="text-2xl">{vehicleEmojis[searchResult.category]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-brand-charcoal text-sm">{searchResult.plate_number}</p>
                        <p className="text-gray-400 text-xs">{vehicleLabels[searchResult.category]}</p>
                      </div>
                      <span className={`text-xs ${vehicleStatusColor[searchResult.status]}`}>{searchResult.status}</span>
                      {favorites.some((f) => f.vehicle_id === searchResult.id) ? (
                        <span className="text-xs text-brand-orange font-medium px-3 py-1.5">Favorited</span>
                      ) : (
                        <button
                          onClick={() => handleFavorite(searchResult.id)}
                          className="text-xs bg-brand-charcoal text-white px-3 py-1.5 rounded-lg hover:bg-brand-orange transition-colors"
                        >
                          Add to favorites
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="card-white p-6">
                  <h3 className="font-semibold text-brand-charcoal mb-1">My favorite matatus</h3>
                  <p className="text-gray-400 text-sm mb-5">{favorites.length} tracked</p>
                  <div className="space-y-3">
                    {favorites.map((f) => (
                      <div key={f.favorite_id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <span className="text-2xl">{vehicleEmojis[f.category]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-brand-charcoal text-sm">{f.plate_number}</p>
                          <p className="text-gray-400 text-xs">
                            {f.location
                              ? `Last seen ${formatDateTime(f.location.updated_at || f.favorited_at)}`
                              : 'No recent location'}
                          </p>
                        </div>
                        <span className={`text-xs ${vehicleStatusColor[f.status]}`}>{f.status}</span>
                        <button
                          onClick={() => handleUnfavorite(f.vehicle_id)}
                          className="text-xs text-gray-400 hover:text-red-500 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {favorites.length === 0 && (
                      <p className="text-sm text-gray-400">
                        No favorites yet — search for a matatu above and add it to start tracking.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>

  )
}

