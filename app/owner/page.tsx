'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  TrendingUp, Truck, Bell, DollarSign, Users, Activity,
  CheckCircle, Clock, Zap, Settings, Home, LayoutDashboard,
  Landmark, ArrowUpRight, LogOut, ChevronDown, Plus, X, Loader2,
  MapPin, CreditCard, AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import {
  paymentConfigApi, payoutsApi, routesApi, transactionsApi, vehiclesApi
} from '@/lib/api'
import { earningsData, mockVehicles, vehicleEmojis, vehicleLabels } from '@/lib/mock-data'
import {
  formatCurrency, formatDate, formatDateTime, getInitials, vehicleStatusColor, payoutStatusColor
} from '@/lib/utils'
import type {
  MerchantPaymentConfigOut, PayoutOut, RouteOut, TransactionOut,
  VehicleCategory, VehicleOut, VehicleStatus
} from '@/lib/types'

type Tab = 'overview' | 'fleet' | 'earnings' | 'credit'
type Period = 'daily' | 'weekly' | 'monthly'

export default function OwnerDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [period, setPeriod] = useState<Period>('daily')

  // Live data
  const [vehicles, setVehicles] = useState<VehicleOut[]>([])
  const [routes, setRoutes] = useState<RouteOut[]>([])
  const [transactions, setTransactions] = useState<TransactionOut[]>([])
  const [payouts, setPayouts] = useState<PayoutOut[]>([])
  const [summary, setSummary] = useState<{ gross: string | null; net: string | null; commission: string | null } | null>(null)
  const [paymentConfig, setPaymentConfig] = useState<MerchantPaymentConfigOut | null>(null)

  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  // Modals
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [showRouteModal, setShowRouteModal] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOut | null>(null)
  const [assignDriverId, setAssignDriverId] = useState('')
  const [activateRouteId, setActivateRouteId] = useState('')

  // Forms
  const [vehicleForm, setVehicleForm] = useState({
    category: 'matatu' as VehicleCategory,
    plate_number: '',
    ussd_code: '',
    make: '',
    model: '',
    capacity: 14,
  })
  const [routeForm, setRouteForm] = useState({ name: '', start_point: '', end_point: '', base_fare: '' })
  const [withdrawPayout, setWithdrawPayout] = useState<PayoutOut | null>(null)
  const [withdrawForm, setWithdrawForm] = useState({ destination_type: 'mpesa' as const, destination: '', amount: '' })
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const ownerName = user?.full_name || user?.phone_number || 'Fleet Owner'

  const load = async (key: string, fn: () => Promise<void>) => {
    setLoading((p) => ({ ...p, [key]: true }))
    try { await fn() } catch (err) { console.error(err) }
    setLoading((p) => ({ ...p, [key]: false }))
  }

  useEffect(() => {
    load('initial', async () => {
      try {
        const [v, r, tx, p, s, pc] = await Promise.all([
          vehiclesApi.list(),
          routesApi.list(),
          transactionsApi.list(),
          payoutsApi.list(),
          payoutsApi.summary(),
          paymentConfigApi.get(),
        ])
        setVehicles(v)
        setRoutes(r)
        setTransactions(tx)
        setPayouts(p)
        setSummary(s)
        setPaymentConfig(pc)
      } catch (err) {
        setError('Live owner data could not be loaded. Showing demo data.')
      }
    })
  }, [])

  const fleet = vehicles.length > 0 ? vehicles : mockVehicles.map((v) => ({
    id: v.id,
    owner_id: user?.id || '',
    category: v.type,
    plate_number: v.plate,
    ussd_code: '',
    make: null,
    model: null,
    capacity: v.capacity,
    status: v.status,
    route_id: null,
    created_at: '',
  } as VehicleOut))

  const totalEarnings = useMemo(() => {
    return transactions
      .filter((t) => t.status === 'success')
      .reduce((sum, t) => sum + parseFloat(t.total_amount), 0)
  }, [transactions])

  const activeVehicles = fleet.filter((v) => v.status === 'active').length

  const chartData = useMemo(() => {
    // Build from transactions grouped by date
    const map = new Map<string, number>()
    transactions.filter((t) => t.status === 'success').forEach((t) => {
      const date = new Date(t.created_at).toLocaleDateString('en-KE', { weekday: 'short' })
      map.set(date, (map.get(date) || 0) + parseFloat(t.total_amount))
    })
    if (map.size > 0) {
      return Array.from(map.entries()).map(([label, earnings]) => ({ label, earnings }))
    }
    return earningsData.daily
  }, [transactions])

  const periodEarnings = chartData.reduce((s, d) => s + d.earnings, 0)

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionMsg(null)
    try {
      const created = await vehiclesApi.create(vehicleForm)
      setVehicles((prev) => [...prev, created])
      setShowVehicleModal(false)
      setActionMsg({ type: 'success', text: `Vehicle ${created.plate_number} registered.` })
    } catch (err) {
      setActionMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to register vehicle' })
    }
  }

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionMsg(null)
    try {
      const created = await routesApi.create({
        name: routeForm.name,
        start_point: routeForm.start_point,
        end_point: routeForm.end_point,
        base_fare: parseFloat(routeForm.base_fare),
      })
      setRoutes((prev) => [...prev, created])
      setShowRouteModal(false)
      setActionMsg({ type: 'success', text: `Route ${created.name} created.` })
    } catch (err) {
      setActionMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to create route' })
    }
  }

  const handleAssignDriver = async () => {
    if (!selectedVehicle || !assignDriverId) return
    setActionMsg(null)
    try {
      await vehiclesApi.assignDriver(selectedVehicle.id, { driver_id: assignDriverId })
      setActionMsg({ type: 'success', text: 'Driver assigned.' })
      setSelectedVehicle(null)
      const v = await vehiclesApi.list()
      setVehicles(v)
    } catch (err) {
      setActionMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to assign driver' })
    }
  }

  const handleActivateRoute = async () => {
    if (!selectedVehicle || !activateRouteId) return
    setActionMsg(null)
    try {
      await vehiclesApi.activateRoute(selectedVehicle.id, { route_id: activateRouteId })
      setActionMsg({ type: 'success', text: 'Route activated.' })
      setSelectedVehicle(null)
      const v = await vehiclesApi.list()
      setVehicles(v)
    } catch (err) {
      setActionMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to activate route' })
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!withdrawPayout) return
    setActionMsg(null)
    try {
      await payoutsApi.withdraw(withdrawPayout.id, {
        destination_type: withdrawForm.destination_type,
        destination: withdrawForm.destination,
        amount: withdrawForm.amount ? parseFloat(withdrawForm.amount) : undefined,
      })
      setActionMsg({ type: 'success', text: 'Withdrawal initiated.' })
      setWithdrawPayout(null)
      const p = await payoutsApi.list()
      setPayouts(p)
    } catch (err) {
      setActionMsg({ type: 'error', text: err instanceof Error ? err.message : 'Withdrawal failed' })
    }
  }

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'fleet', label: 'Fleet', icon: <Truck className="w-4 h-4" /> },
    { id: 'earnings', label: 'Earnings', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'credit', label: 'Credit', icon: <Landmark className="w-4 h-4" /> },
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
          <div className="mt-3 text-xs bg-amber-50 text-amber-700 font-medium px-2 py-1 rounded-lg inline-block">Fleet Owner</div>
        </div>

        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold text-sm">
              {getInitials(ownerName)}
            </div>
            <div>
              <p className="font-semibold text-brand-charcoal text-sm">{ownerName}</p>
              <p className="text-gray-400 text-xs">{fleet.length} vehicles registered</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`owner-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-nav-item w-full ${activeTab === item.id ? 'sidebar-nav-active' : 'sidebar-nav-inactive'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link href="/commuter" className="sidebar-nav-item sidebar-nav-inactive w-full">
            <Users className="w-4 h-4" /> Commuter App
          </Link>
          <Link href="/admin" className="sidebar-nav-item sidebar-nav-inactive w-full">
            <Settings className="w-4 h-4" /> Admin
          </Link>
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
              <h1 className="font-bold text-brand-charcoal text-lg">Fleet Owner Dashboard</h1>
              <p className="text-gray-400 text-xs">Real-time fleet & earnings management</p>
            </div>
            <div className="flex items-center gap-3">
              <button id="owner-notif-btn" className="relative p-2 rounded-xl hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
              </button>
              <div className="w-8 h-8 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold text-xs">
                {getInitials(ownerName)}
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

        {actionMsg && (
          <div className={`px-6 py-3 text-sm flex items-center gap-2 ${actionMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {actionMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {actionMsg.text}
            <button onClick={() => setActionMsg(null)} className="ml-auto font-medium hover:underline">Dismiss</button>
          </div>
        )}

        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Earnings', value: formatCurrency(totalEarnings), icon: <DollarSign className="w-4 h-4 text-brand-orange" />, trend: '+12%' },
                    { label: 'Active Vehicles', value: `${activeVehicles} / ${fleet.length}`, icon: <Truck className="w-4 h-4 text-blue-500" />, trend: '' },
                    { label: 'Net Payouts', value: formatCurrency(summary?.net || 0), icon: <TrendingUp className="w-4 h-4 text-emerald-500" />, trend: '+8%' },
                    { label: 'Platform Fee', value: paymentConfig ? `${(parseFloat(paymentConfig.commission_rate) * 100).toFixed(0)}%` : '8%', icon: <Activity className="w-4 h-4 text-purple-500" />, trend: '' },
                  ].map((kpi, i) => (
                    <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="stat-card">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-500">{kpi.label}</p>
                        <div className="bg-gray-50 p-1.5 rounded-lg">{kpi.icon}</div>
                      </div>
                      <p className="text-xl font-bold text-brand-charcoal">{kpi.value}</p>
                      {kpi.trend && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-medium">
                          <ArrowUpRight className="w-3 h-3" />{kpi.trend} vs yesterday
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2 card-white p-5">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-semibold text-brand-charcoal">Earnings</h3>
                      <span className="badge-success text-xs">Live</span>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                        <Tooltip formatter={(v: number) => [formatCurrency(v), 'Earnings']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="earnings" fill="#FF6B00" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="card-white p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-brand-charcoal">Live Feed</h3>
                      <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-3 overflow-y-auto max-h-56 no-scrollbar">
                      {transactions.slice(0, 5).map((t) => (
                        <div key={t.id} className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${t.status === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                            {t.status === 'success' ? '💳' : '⚠️'}
                          </div>
                          <div>
                            <p className="text-xs text-gray-700 leading-snug">{formatCurrency(t.total_amount)} · {t.method.replace('_', ' ')}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(t.created_at)}</p>
                          </div>
                        </div>
                      ))}
                      {transactions.length === 0 && <p className="text-sm text-gray-400">No recent transactions.</p>}
                    </div>
                  </div>
                </div>

                <div className="card-white p-5">
                  <h3 className="font-semibold text-brand-charcoal mb-4">Fleet Status</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {fleet.map((v) => (
                      <div key={v.id} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                        <span className="text-2xl">{vehicleEmojis[v.category]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-brand-charcoal text-sm">{v.plate_number}</p>
                          <p className="text-gray-400 text-xs truncate">{routes.find((r) => r.id === v.route_id)?.name || v.category}</p>
                        </div>
                        <span className={`text-xs ${vehicleStatusColor[v.status]}`}>{v.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'fleet' && (
              <motion.div key="fleet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="card-white overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h3 className="font-semibold text-brand-charcoal">Registered Vehicles</h3>
                      <p className="text-gray-400 text-sm">{fleet.length} vehicles in fleet</p>
                    </div>
                    <button id="add-vehicle-btn" onClick={() => setShowVehicleModal(true)} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                      <Plus className="w-3.5 h-3.5" /> Register Vehicle
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Vehicle</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Route</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Capacity</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {fleet.map((v) => (
                          <tr key={v.id} className="table-row-hover">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{vehicleEmojis[v.category]}</span>
                                <div>
                                  <p className="font-semibold text-brand-charcoal">{v.plate_number}</p>
                                  <p className="text-gray-400 text-xs">{v.make || v.model || vehicleLabels[v.category]}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-gray-500 text-xs">
                              {routes.find((r) => r.id === v.route_id)?.name || '-'}
                            </td>
                            <td className="px-5 py-4 text-gray-600">{v.capacity}</td>
                            <td className="px-5 py-4"><span className={`text-xs ${vehicleStatusColor[v.status]}`}>{v.status}</span></td>
                            <td className="px-5 py-4">
                              <button onClick={() => { setSelectedVehicle(v); setAssignDriverId(''); setActivateRouteId(v.route_id || '') }} className="text-xs text-brand-orange font-medium hover:underline">
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card-white overflow-hidden mt-5">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-brand-charcoal">Routes</h3>
                      <p className="text-gray-400 text-sm">{routes.length} routes</p>
                    </div>
                    <button onClick={() => setShowRouteModal(true)} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                      <Plus className="w-3.5 h-3.5" /> Create Route
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {routes.map((r) => (
                      <div key={r.id} className="flex items-center gap-4 px-5 py-4 table-row-hover">
                        <div className="flex-1">
                          <p className="font-semibold text-brand-charcoal text-sm">{r.name}</p>
                          <p className="text-gray-400 text-xs">{r.start_point} → {r.end_point}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-brand-charcoal text-sm">{formatCurrency(r.base_fare)}</p>
                          <span className={`text-xs ${r.is_active ? 'badge-success' : 'badge-warning'}`}>{r.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </div>
                    ))}
                    {routes.length === 0 && <p className="px-5 py-6 text-sm text-gray-400">No routes created yet.</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'earnings' && (
              <motion.div key="earnings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="flex gap-2">
                  {(['daily', 'weekly', 'monthly'] as Period[]).map((p) => (
                    <button
                      key={p}
                      id={`period-${p}`}
                      onClick={() => setPeriod(p)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                        period === p ? 'bg-brand-orange text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-orange/30'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Volume', value: formatCurrency(summary?.gross || totalEarnings) },
                    { label: 'Commission', value: formatCurrency(summary?.commission || totalEarnings * 0.08) },
                    { label: 'Net Earnings', value: formatCurrency(summary?.net || totalEarnings * 0.92) },
                  ].map((s, i) => (
                    <div key={s.label} className={`stat-card ${i === 2 ? 'border-brand-orange/20 bg-orange-50' : ''}`}>
                      <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                      <p className={`text-xl font-bold ${i === 2 ? 'text-brand-orange' : 'text-brand-charcoal'}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="card-white p-6">
                  <h3 className="font-semibold text-brand-charcoal mb-5">Earnings Breakdown</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: number) => [formatCurrency(v), 'Earnings']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="earnings" fill="#FF6B00" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card-white overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-brand-charcoal">Payouts</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Period</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Gross</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Net</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {payouts.map((p) => (
                          <tr key={p.id} className="table-row-hover">
                            <td className="px-5 py-4 text-gray-700 text-xs">{formatDate(p.period_start)}</td>
                            <td className="px-5 py-4 font-semibold text-brand-charcoal">{formatCurrency(p.gross_earnings)}</td>
                            <td className="px-5 py-4 text-brand-charcoal">{formatCurrency(p.net_payout)}</td>
                            <td className="px-5 py-4"><span className={`text-xs ${payoutStatusColor[p.status]}`}>{p.status}</span></td>
                            <td className="px-5 py-4">
                              {p.status === 'pending' && (
                                <button onClick={() => setWithdrawPayout(p)} className="text-xs bg-brand-charcoal text-white px-3 py-1.5 rounded-lg hover:bg-brand-orange transition-colors">
                                  Withdraw
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {payouts.length === 0 && (
                          <tr><td colSpan={5} className="px-5 py-6 text-sm text-gray-400 text-center">No payouts yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'credit' && (
              <motion.div key="credit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="bg-brand-charcoal rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/10 rounded-full blur-3xl" />
                  <div className="relative">
                    <p className="text-white/60 text-sm mb-4">Owner Credit Score</p>
                    <div className="flex items-end gap-4 mb-4">
                      <span className="text-white text-6xl font-black">724</span>
                      <div className="mb-2">
                        <span className="badge bg-emerald-500/20 text-emerald-400 text-sm font-semibold">Good</span>
                        <p className="text-white/40 text-xs mt-1">Based on platform earnings</p>
                      </div>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full mb-4">
                      <div className="h-full bg-gradient-to-r from-brand-orange to-emerald-400 rounded-full" style={{ width: '72%' }} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Trip Volume', score: '98%', color: 'text-emerald-400' },
                        { label: 'Tenure', score: '85%', color: 'text-blue-400' },
                        { label: 'Repayment', score: '100%', color: 'text-emerald-400' },
                      ].map((s) => (
                        <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                          <p className={`font-bold ${s.color}`}>{s.score}</p>
                          <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card-white p-5">
                  <h3 className="font-semibold text-brand-charcoal mb-4">Available Credit Lines</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Working Capital Loan', limit: 150000, rate: '2.5% / month', status: 'eligible', icon: '💼' },
                      { name: 'Fleet Expansion Credit', limit: 500000, rate: '1.8% / month', status: 'eligible', icon: '🚌' },
                      { name: 'Emergency Fund', limit: 30000, rate: '3.0% / month', status: 'active', icon: '⚡' },
                    ].map((credit) => (
                      <div key={credit.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <span className="text-2xl">{credit.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-brand-charcoal text-sm">{credit.name}</p>
                          <p className="text-gray-400 text-xs">{formatCurrency(credit.limit)} limit · {credit.rate}</p>
                        </div>
                        <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                          credit.status === 'active'
                            ? 'bg-brand-orange/10 text-brand-orange'
                            : 'bg-brand-charcoal text-white hover:bg-brand-orange'
                        }`}>
                          {credit.status === 'active' ? 'Repay' : 'Apply'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-white p-5">
                  <h3 className="font-semibold text-brand-charcoal mb-4">Request Payout</h3>
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-gray-500 text-sm">Available for withdrawal</p>
                    <p className="text-3xl font-black text-brand-charcoal mt-1">{formatCurrency(summary?.net || totalEarnings * 0.92)}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setWithdrawPayout(payouts[0] || null)} className="flex-1 btn-primary py-3 text-sm">📱 M-Pesa Withdrawal</button>
                    <button className="flex-1 bg-white border border-gray-200 text-gray-700 hover:border-brand-orange/40 font-medium text-sm rounded-full transition-all py-3">🏦 Bank Transfer</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Register Vehicle Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-brand-charcoal text-lg">Register Vehicle</h3>
              <button onClick={() => setShowVehicleModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreateVehicle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Category</label>
                <select value={vehicleForm.category} onChange={(e) => setVehicleForm({ ...vehicleForm, category: e.target.value as VehicleCategory })} className="input-light">
                  {(['matatu', 'taxi', 'boda'] as VehicleCategory[]).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Plate Number</label>
                <input value={vehicleForm.plate_number} onChange={(e) => setVehicleForm({ ...vehicleForm, plate_number: e.target.value })} className="input-light" placeholder="KXX 123X" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">USSD Code</label>
                <input value={vehicleForm.ussd_code} onChange={(e) => setVehicleForm({ ...vehicleForm, ussd_code: e.target.value })} className="input-light" placeholder="*123#" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Make</label>
                  <input value={vehicleForm.make} onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })} className="input-light" placeholder="Toyota" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Model</label>
                  <input value={vehicleForm.model} onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })} className="input-light" placeholder="Hiace" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Capacity</label>
                <input type="number" value={vehicleForm.capacity} onChange={(e) => setVehicleForm({ ...vehicleForm, capacity: parseInt(e.target.value) || 0 })} className="input-light" />
              </div>
              <button type="submit" className="w-full btn-primary py-3">Register Vehicle</button>
            </form>
          </div>
        </div>
      )}

      {/* Create Route Modal */}
      {showRouteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-brand-charcoal text-lg">Create Route</h3>
              <button onClick={() => setShowRouteModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreateRoute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Route Name</label>
                <input value={routeForm.name} onChange={(e) => setRouteForm({ ...routeForm, name: e.target.value })} className="input-light" placeholder="CBD - Westlands" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Start</label>
                  <input value={routeForm.start_point} onChange={(e) => setRouteForm({ ...routeForm, start_point: e.target.value })} className="input-light" placeholder="CBD" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-1.5">End</label>
                  <input value={routeForm.end_point} onChange={(e) => setRouteForm({ ...routeForm, end_point: e.target.value })} className="input-light" placeholder="Westlands" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Base Fare (KES)</label>
                <input type="number" value={routeForm.base_fare} onChange={(e) => setRouteForm({ ...routeForm, base_fare: e.target.value })} className="input-light" placeholder="70" required />
              </div>
              <button type="submit" className="w-full btn-primary py-3">Create Route</button>
            </form>
          </div>
        </div>
      )}

      {/* Manage Vehicle Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-brand-charcoal text-lg">Manage {selectedVehicle.plate_number}</h3>
              <button onClick={() => setSelectedVehicle(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Assign Driver (User ID)</label>
                <div className="flex gap-2">
                  <input value={assignDriverId} onChange={(e) => setAssignDriverId(e.target.value)} className="input-light flex-1" placeholder="Driver user ID" />
                  <button onClick={handleAssignDriver} className="btn-primary px-4">Assign</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Activate Route</label>
                <div className="flex gap-2">
                  <select value={activateRouteId} onChange={(e) => setActivateRouteId(e.target.value)} className="input-light flex-1">
                    <option value="">Select route</option>
                    {routes.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                  <button onClick={handleActivateRoute} className="btn-primary px-4">Activate</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {withdrawPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-brand-charcoal text-lg">Withdraw Payout</h3>
              <button onClick={() => setWithdrawPayout(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Destination Type</label>
                <select value={withdrawForm.destination_type} onChange={(e) => setWithdrawForm({ ...withdrawForm, destination_type: e.target.value as any })} className="input-light">
                  {['mpesa', 'loop_till', 'mpesa_till', 'mpesa_paybill'].map((d) => (
                    <option key={d} value={d}>{d.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Destination</label>
                <input value={withdrawForm.destination} onChange={(e) => setWithdrawForm({ ...withdrawForm, destination: e.target.value })} className="input-light" placeholder="2547XX XXX XXX" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Amount (leave blank for full payout)</label>
                <input type="number" value={withdrawForm.amount} onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })} className="input-light" placeholder={formatCurrency(withdrawPayout.net_payout)} />
              </div>
              <button type="submit" className="w-full btn-primary py-3">Withdraw</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
