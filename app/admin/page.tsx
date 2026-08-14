'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'
import {
  Users, Truck, DollarSign, Activity, Shield, Search, CheckCircle,
  XCircle, Clock, Zap, Settings, LayoutDashboard, MapPin, CreditCard,
  AlertTriangle, ChevronDown, LogOut, FileText, BarChart2, Plus, X, Loader2
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { useRequireRole } from '@/lib/require-role'
import { adminApi, transactionsApi, vehiclesApi } from '@/lib/api'
import {
  allUsers, allTransactions, mockVehicles, pendingVehicles,
  vehicleEmojis, vehicleLabels
} from '@/lib/mock-data'
import {
  formatCurrency, formatDateTime, formatDate, getInitials,
  transactionStatusColor, vehicleStatusColor
} from '@/lib/utils'
import type { TransactionOut, VehicleDocumentOut, VehicleOut } from '@/lib/types'

type Tab = 'overview' | 'users' | 'transactions' | 'vehicles' | 'cards' | 'telemetry'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const { isReady } = useRequireRole('admin')
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [txFilter, setTxFilter] = useState<'all' | string>('all')

  // Live data
  const [vehicles, setVehicles] = useState<VehicleOut[]>([])
  const [transactions, setTransactions] = useState<TransactionOut[]>([])
  const [revenue, setRevenue] = useState<{ total_volume: string; transaction_count: number } | null>(null)
  const [density, setDensity] = useState<{ active_vehicles: number } | null>(null)
  const [compliance, setCompliance] = useState<Record<string, unknown>[]>([])
  const [cards, setCards] = useState<{ id: string; card_uid: string; user_id: string | null; status: string }[]>([])

  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  // Actions
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOut | null>(null)
  const [vehicleDocs, setVehicleDocs] = useState<VehicleDocumentOut[]>([])
  const [cardInput, setCardInput] = useState('')
  const [bulkCount, setBulkCount] = useState('10')
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [unassignedCards, setUnassignedCards] = useState<{ id: string; card_uid: string }[]>([])
  const [selectedCardId, setSelectedCardId] = useState('')
  const [assignUserId, setAssignUserId] = useState('')

  const load = async (key: string, fn: () => Promise<void>) => {
    setLoading((p) => ({ ...p, [key]: true }))
    try { await fn() } catch (err) { console.error(err) }
    setLoading((p) => ({ ...p, [key]: false }))
  }

  useEffect(() => {
    load('initial', async () => {
      try {
        const [v, tx, rev, den, comp, c, unassigned] = await Promise.all([
          vehiclesApi.list(),
          transactionsApi.list(),
          adminApi.revenue(),
          adminApi.fleetDensity(),
          adminApi.fleetCompliance(),
          adminApi.listCards('active'),
          adminApi.listCards('unassigned'),
        ])
        setVehicles(v)
        setTransactions(tx)
        setRevenue(rev)
        setDensity(den)
        setCompliance(comp)
        setCards(c)
        setUnassignedCards(unassigned)
      } catch (err) {
        setError('Live admin data could not be loaded. Showing demo data.')
      }
    })
  }, [])

  const fleet = vehicles.length > 0 ? vehicles : mockVehicles.map((v) => ({
    id: v.id,
    owner_id: '',
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

  const txList = transactions.length > 0 ? transactions : allTransactions.map((t) => ({
    id: t.id,
    trip_id: null,
    vehicle_id: t.vehicleId,
    route_id: null,
    payer_id: t.userId,
    owner_id: null,
    method: t.paymentMethod === 'tap-to-pay' ? 'tap_card' : t.paymentMethod,
    base_fare: String(t.amount),
    dynamic_charges: '0',
    tip_amount: '0',
    total_amount: String(t.amount),
    status: t.status === 'completed' ? 'success' : t.status,
    failure_reason: null,
    provider_reference: '',
    created_at: t.timestamp,
    settled_at: null,
  } as TransactionOut))

  const filteredUsers = allUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.cardId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTx = txFilter === 'all' ? txList : txList.filter((tx) => tx.method === txFilter || tx.status === txFilter)

  const systemMetrics = useMemo(() => {
    const map = new Map<string, { transactions: number; revenue: number }>()
    txList.filter((t) => t.status === 'success').forEach((t) => {
      const day = new Date(t.created_at).toLocaleDateString('en-KE', { weekday: 'short' })
      const cur = map.get(day) || { transactions: 0, revenue: 0 }
      cur.transactions += 1
      cur.revenue += parseFloat(t.total_amount)
      map.set(day, cur)
    })
    if (map.size > 0) {
      return Array.from(map.entries()).map(([day, vals]) => ({ day, ...vals }))
    }
    return [
      { day: 'Mon', transactions: 342, revenue: 28400 },
      { day: 'Tue', transactions: 418, revenue: 34100 },
      { day: 'Wed', transactions: 385, revenue: 31800 },
      { day: 'Thu', transactions: 512, revenue: 42000 },
      { day: 'Fri', transactions: 678, revenue: 55200 },
      { day: 'Sat', transactions: 740, revenue: 61000 },
      { day: 'Sun', transactions: 498, revenue: 41500 },
    ]
  }, [txList])

  const handleRefund = async (tx: TransactionOut) => {
    setActionMsg(null)
    try {
      await transactionsApi.refund(tx.id)
      setActionMsg({ type: 'success', text: `Transaction ${tx.id.slice(0, 8)} refunded.` })
      const updated = await transactionsApi.list()
      setTransactions(updated)
    } catch (err) {
      setActionMsg({ type: 'error', text: err instanceof Error ? err.message : 'Refund failed' })
    }
  }

  const handleVerifyDoc = async (docId: string) => {
    if (!selectedVehicle) return
    setActionMsg(null)
    try {
      await vehiclesApi.verifyDocument(selectedVehicle.id, docId)
      setActionMsg({ type: 'success', text: 'Document verified.' })
      const docs = await vehiclesApi.listDocuments(selectedVehicle.id)
      setVehicleDocs(docs)
    } catch (err) {
      setActionMsg({ type: 'error', text: err instanceof Error ? err.message : 'Verification failed' })
    }
  }

  const openVehicleDocs = async (v: VehicleOut) => {
    setSelectedVehicle(v)
    try {
      const docs = await vehiclesApi.listDocuments(v.id)
      setVehicleDocs(docs)
    } catch {
      setVehicleDocs([])
    }
  }

  const handleRegisterCards = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionMsg(null)
    try {
      const uids = cardInput.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean)
      const res = await adminApi.registerCards({ card_uids: uids })
      setCards((prev) => [...prev, ...res])
      setCardInput('')
      setActionMsg({ type: 'success', text: `${uids.length} card(s) registered.` })
    } catch (err) {
      setActionMsg({ type: 'error', text: err instanceof Error ? err.message : 'Card registration failed' })
    }
  }

  const handleBulkIssue = async () => {
    setActionMsg(null)
    try {
      const res = await adminApi.bulkIssueCards(parseInt(bulkCount) || 10)
      setCardInput(res.join('\n'))
      setActionMsg({ type: 'success', text: `${res.length} demo card UIDs issued.` })
      const unassigned = await adminApi.listCards('unassigned')
      setUnassignedCards(unassigned)
    } catch (err) {
      setActionMsg({ type: 'error', text: err instanceof Error ? err.message : 'Bulk issue failed' })
    }
  }

  const handleAssignCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCardId || !assignUserId) return
    setActionMsg(null)
    try {
      await adminApi.assignCard(selectedCardId, assignUserId)
      setActionMsg({ type: 'success', text: 'Card assigned to user.' })
      const [active, unassigned] = await Promise.all([
        adminApi.listCards('active'),
        adminApi.listCards('unassigned'),
      ])
      setCards(active)
      setUnassignedCards(unassigned)
      setSelectedCardId('')
      setAssignUserId('')
    } catch (err) {
      setActionMsg({ type: 'error', text: err instanceof Error ? err.message : 'Card assignment failed' })
    }
  }

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'users', label: 'User Ledger', icon: <Users className="w-4 h-4" /> },
    { id: 'transactions', label: 'Transactions', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'vehicles', label: 'Fleet Approval', icon: <Truck className="w-4 h-4" /> },
    { id: 'cards', label: 'Tap Cards', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'telemetry', label: 'Telemetry', icon: <Activity className="w-4 h-4" /> },
  ]

  // Nothing rendered until we know this viewer is actually an admin —
  // useRequireRole is already redirecting them away otherwise.
  if (!isReady) return null

  return (
    <div className="min-h-screen bg-brand-neutral flex">
      <aside className="hidden lg:flex flex-col w-64 bg-brand-charcoal fixed h-full">
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-orange rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-white font-bold text-lg">nauli<span className="text-brand-orange">pass</span></span>
          </Link>
          <div className="mt-3 text-xs bg-brand-orange/20 text-brand-orange font-medium px-2 py-1 rounded-lg inline-block">System Admin</div>
        </div>

        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-sm">
              {getInitials(user?.full_name || user?.phone_number || 'Admin')}
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{user?.full_name || 'Super Admin'}</p>
              <p className="text-white/40 text-xs">Full system access</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`admin-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-nav-item w-full ${
                activeTab === item.id
                  ? 'bg-brand-orange text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <button onClick={logout} className="sidebar-nav-item text-white/60 hover:bg-white/10 hover:text-white w-full text-left">
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-brand-charcoal text-lg">Admin Dashboard</h1>
              <p className="text-gray-400 text-xs">System-wide monitoring & management</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-medium">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                All systems operational
              </div>
              <div className="w-8 h-8 bg-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-xs">
                {getInitials(user?.full_name || user?.phone_number || 'Admin')}
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Users', value: allUsers.length.toLocaleString(), sub: `${filteredUsers.length} matched`, icon: <Users className="w-5 h-5" />, color: 'bg-blue-500/10 text-blue-600' },
                    { label: 'Active Vehicles', value: `${density?.active_vehicles || fleet.filter((v) => v.status === 'active').length}`, sub: `${fleet.length} registered total`, icon: <Truck className="w-5 h-5" />, color: 'bg-emerald-500/10 text-emerald-600' },
                    { label: 'Total Volume', value: formatCurrency(revenue?.total_volume || 0), sub: `${revenue?.transaction_count || txList.length} transactions`, icon: <DollarSign className="w-5 h-5" />, color: 'bg-brand-orange/10 text-brand-orange' },
                    { label: 'Pending Docs', value: `${compliance.length}`, sub: 'Need verification', icon: <Activity className="w-5 h-5" />, color: 'bg-purple-500/10 text-purple-600' },
                  ].map((kpi, i) => (
                    <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="stat-card">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-xs text-gray-500">{kpi.label}</p>
                        <div className={`${kpi.color} p-2 rounded-xl`}>{kpi.icon}</div>
                      </div>
                      <p className="text-2xl font-bold text-brand-charcoal">{kpi.value}</p>
                      <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-5">
                  <div className="card-white p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-brand-charcoal">Daily Transactions</h3>
                      <span className="text-xs text-gray-400">Live</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={systemMetrics}>
                        <defs>
                          <linearGradient id="txGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FF6B00" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#FF6B00" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="transactions" stroke="#FF6B00" strokeWidth={2.5} fill="url(#txGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="card-white p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-brand-charcoal">Revenue (KES)</h3>
                      <span className="badge-success text-xs">Live</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={systemMetrics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                        <Tooltip formatter={(v: number) => [formatCurrency(v), 'Revenue']} contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="revenue" fill="#1A1D20" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card-white p-5">
                  <h3 className="font-semibold text-brand-charcoal mb-3">System Alerts</h3>
                  <div className="space-y-2">
                    {compliance.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl text-sm bg-amber-50 text-amber-700">
                        <Truck className="w-4 h-4" />
                        <span>{JSON.stringify(item).slice(0, 120)}</span>
                      </div>
                    ))}
                    {compliance.length === 0 && (
                      <>
                        <div className="flex items-center gap-3 p-3 rounded-xl text-sm bg-amber-50 text-amber-700">
                          <Truck className="w-4 h-4" />
                          <span>{fleet.filter((v) => v.status === 'pending').length} vehicles pending registration approval</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl text-sm bg-emerald-50 text-emerald-700">
                          <CheckCircle className="w-4 h-4" />
                          <span>System revenue: {formatCurrency(revenue?.total_volume || 0)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="card-white overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-brand-charcoal">User & Card Ledger</h3>
                        <p className="text-gray-400 text-sm">{allUsers.length} registered users (demo ledger)</p>
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          id="user-search"
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search by name, ID, card..."
                          className="input-light pl-9 w-64 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">User</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">ID</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Card ID</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Trips</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Points</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Credit</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map((u) => (
                          <tr key={u.id} className="table-row-hover">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-brand-orange/10 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold">
                                  {getInitials(u.name)}
                                </div>
                                <div>
                                  <p className="font-medium text-brand-charcoal">{u.name}</p>
                                  <p className="text-gray-400 text-xs">{u.phone}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{u.id}</td>
                            <td className="px-5 py-3.5 font-mono text-xs text-blue-600">{u.cardId}</td>
                            <td className="px-5 py-3.5 font-semibold">{u.totalTrips}</td>
                            <td className="px-5 py-3.5 text-yellow-600 font-medium">{u.loyaltyPoints.toLocaleString()}</td>
                            <td className="px-5 py-3.5">
                              {u.creditEligible
                                ? <span className="badge-success text-xs">Eligible</span>
                                : <span className="badge text-xs bg-gray-100 text-gray-400">Locked</span>}
                            </td>
                            <td className="px-5 py-3.5">
                              {u.status === 'active'
                                ? <span className="badge-success text-xs">Active</span>
                                : <span className="badge-error text-xs">Suspended</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'transactions' && (
              <motion.div key="transactions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="card-white overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-brand-charcoal">Transaction Ledger</h3>
                        <p className="text-gray-400 text-sm">Real-time financial monitoring</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {['all', 'tap_card', 'qr', 'in_app', 'success', 'failed'].map((f) => (
                          <button
                            key={f}
                            id={`tx-filter-${f}`}
                            onClick={() => setTxFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                              txFilter === f ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {f.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">ID</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Method</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Amount</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Time</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredTx.map((tx) => (
                          <tr key={tx.id} className="table-row-hover">
                            <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{tx.id.slice(0, 8)}</td>
                            <td className="px-5 py-3.5 text-gray-600 text-xs capitalize">{tx.method.replace('_', ' ')}</td>
                            <td className="px-5 py-3.5 font-bold text-brand-charcoal">{formatCurrency(tx.total_amount)}</td>
                            <td className="px-5 py-3.5"><span className={`text-xs ${transactionStatusColor[tx.status]}`}>{tx.status}</span></td>
                            <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDateTime(tx.created_at)}</td>
                            <td className="px-5 py-3.5">
                              {tx.status === 'success' && (
                                <button onClick={() => handleRefund(tx)} className="text-xs bg-brand-charcoal text-white px-3 py-1.5 rounded-lg hover:bg-brand-orange transition-colors">
                                  Refund
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {filteredTx.length === 0 && (
                          <tr><td colSpan={6} className="px-5 py-6 text-sm text-gray-400 text-center">No transactions found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'vehicles' && (
              <motion.div key="vehicles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="card-white overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-brand-charcoal">Pending Approval</h3>
                      <p className="text-gray-400 text-sm">{fleet.filter((v) => v.status === 'pending').length} vehicles awaiting verification</p>
                    </div>
                    <span className="badge-warning text-xs">{fleet.filter((v) => v.status === 'pending').length} pending</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {fleet.filter((v) => v.status === 'pending').map((v) => (
                      <div key={v.id} className="flex items-center gap-4 px-5 py-4 table-row-hover">
                        <span className="text-2xl">{vehicleEmojis[v.category]}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-brand-charcoal">{v.plate_number}</p>
                          <p className="text-gray-400 text-xs">{v.make || v.model || 'Submitted recently'}</p>
                        </div>
                        <span className="capitalize text-xs font-medium text-gray-500">{vehicleLabels[v.category]}</span>
                        <div className="flex gap-2">
                          <button onClick={() => openVehicleDocs(v)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {fleet.filter((v) => v.status === 'pending').length === 0 && (
                      <p className="px-5 py-6 text-sm text-gray-400">No pending vehicles.</p>
                    )}
                  </div>
                </div>

                <div className="card-white overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-brand-charcoal">All Registered Vehicles</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Vehicle</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Plate</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Capacity</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Docs</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {fleet.map((v) => (
                          <tr key={v.id} className="table-row-hover">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{vehicleEmojis[v.category]}</span>
                                <div>
                                  <p className="font-semibold text-brand-charcoal">{vehicleLabels[v.category]}</p>
                                  <p className="text-gray-400 text-xs">{v.make || v.model || '-'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-gray-700">{v.plate_number}</td>
                            <td className="px-5 py-3.5 text-gray-600">{v.capacity}</td>
                            <td className="px-5 py-3.5"><span className={`text-xs ${vehicleStatusColor[v.status]}`}>{v.status}</span></td>
                            <td className="px-5 py-3.5">
                              <button onClick={() => openVehicleDocs(v)} className="text-xs text-brand-orange font-medium hover:underline">View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'cards' && (
              <motion.div key="cards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="stat-card">
                    <p className="text-xs text-gray-500 mb-1">Active cards</p>
                    <p className="text-2xl font-bold text-brand-charcoal">{cards.length}</p>
                  </div>
                  <div className="stat-card">
                    <p className="text-xs text-gray-500 mb-1">Unassigned (empty) cards</p>
                    <p className="text-2xl font-bold text-brand-charcoal">{unassignedCards.length}</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-5">
                  <form onSubmit={handleRegisterCards} className="card-white p-5 space-y-3">
                    <h3 className="font-semibold text-brand-charcoal">Register real card UIDs</h3>
                    <p className="text-gray-400 text-xs">Read a physical card&apos;s hardware UID off the NFC reader&apos;s Serial Monitor first.</p>
                    <textarea
                      value={cardInput}
                      onChange={(e) => setCardInput(e.target.value)}
                      placeholder="Paste card UIDs separated by commas or new lines"
                      className="input-light min-h-[100px]"
                    />
                    <button type="submit" className="btn-primary text-sm py-2 px-4">Register Cards</button>
                  </form>

                  <div className="card-white p-5 space-y-3">
                    <h3 className="font-semibold text-brand-charcoal">Bulk-issue demo cards</h3>
                    <p className="text-gray-400 text-xs">Placeholder UIDs for QA — won&apos;t match a real tapped card.</p>
                    <div className="flex gap-2">
                      <input type="number" value={bulkCount} onChange={(e) => setBulkCount(e.target.value)} className="input-light w-24" />
                      <button onClick={handleBulkIssue} className="btn-primary text-sm py-2 px-4">Issue</button>
                    </div>
                  </div>
                </div>

                <div className="card-white overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-brand-charcoal">Empty cards</h3>
                    <p className="text-gray-400 text-sm">{unassignedCards.length} unassigned — pick one to assign to a user</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {unassignedCards.map((c) => (
                      <div key={c.id} className="flex items-center gap-3 px-5 py-3.5">
                        <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-mono text-sm text-brand-charcoal flex-1">{c.card_uid}</span>
                        <button
                          onClick={() => setSelectedCardId(c.id)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                            selectedCardId === c.id ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {selectedCardId === c.id ? 'Selected' : 'Select to assign'}
                        </button>
                      </div>
                    ))}
                    {unassignedCards.length === 0 && (
                      <p className="px-5 py-6 text-sm text-gray-400">No empty cards right now.</p>
                    )}
                  </div>
                  {selectedCardId && (
                    <form onSubmit={handleAssignCard} className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={assignUserId}
                        onChange={(e) => setAssignUserId(e.target.value)}
                        placeholder="User ID to assign this card to"
                        className="input-light flex-1"
                        required
                      />
                      <button type="submit" className="btn-primary text-sm py-2 px-4">Assign</button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'telemetry' && (
              <motion.div key="telemetry" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="card-white overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-brand-charcoal">System Telemetry Map</h3>
                      <p className="text-gray-400 text-sm">All active vehicles across Nairobi</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      Live
                    </div>
                  </div>

                  <div className="relative h-[480px] bg-brand-charcoal overflow-hidden">
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #1e2530 0%, #1A1D20 50%, #0f1215 100%)' }}>
                      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="adminGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#FF6B00" strokeWidth="0.4" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#adminGrid)" />
                        <line x1="0" y1="38%" x2="100%" y2="38%" stroke="#4ade80" strokeWidth="2" opacity="0.3" />
                        <line x1="0" y1="62%" x2="100%" y2="62%" stroke="#4ade80" strokeWidth="1.5" opacity="0.2" />
                        <line x1="28%" y1="0" x2="28%" y2="100%" stroke="#4ade80" strokeWidth="2" opacity="0.3" />
                        <line x1="62%" y1="0" x2="62%" y2="100%" stroke="#4ade80" strokeWidth="1.5" opacity="0.2" />
                        <text x="30%" y="40%" fill="#4ade80" fontSize="10" opacity="0.5">CBD</text>
                        <text x="8%" y="32%" fill="#4ade80" fontSize="8" opacity="0.4">Westlands</text>
                        <text x="65%" y="58%" fill="#4ade80" fontSize="8" opacity="0.4">Eastleigh</text>
                        <text x="12%" y="65%" fill="#4ade80" fontSize="8" opacity="0.4">Karen</text>
                        <text x="65%" y="25%" fill="#4ade80" fontSize="8" opacity="0.4">Kasarani</text>
                        <text x="45%" y="75%" fill="#4ade80" fontSize="8" opacity="0.4">Rongai</text>
                      </svg>
                    </div>

                    {fleet.map((v, i) => {
                      const positions = [
                        { top: '45%', left: '55%' },
                        { top: '35%', left: '25%' },
                        { top: '55%', left: '65%' },
                        { top: '30%', left: '55%' },
                        { top: '60%', left: '35%' },
                        { top: '22%', left: '68%' },
                      ]
                      const pos = positions[i] || { top: '50%', left: '50%' }
                      const colors: Record<string, string> = { active: '#4ade80', inactive: '#f59e0b', suspended: '#ef4444', pending: '#6b7280' }
                      return (
                        <motion.div
                          key={v.id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2"
                          style={{ top: pos.top, left: pos.left }}
                        >
                          {v.status === 'active' && (
                            <div className="absolute inset-0 rounded-full animate-ping-slow opacity-30" style={{ backgroundColor: colors[v.status], transform: 'scale(2.5)' }} />
                          )}
                          <div
                            className="relative w-9 h-9 rounded-full flex items-center justify-center text-sm shadow-lg z-10 cursor-pointer hover:scale-125 transition-transform duration-200"
                            style={{ backgroundColor: colors[v.status] }}
                            title={`${v.plate_number}`}
                          >
                            {vehicleEmojis[v.category]}
                          </div>
                          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white text-xs text-gray-800 font-medium px-2 py-0.5 rounded-full shadow whitespace-nowrap">
                            {v.plate_number}
                          </div>
                        </motion.div>
                      )
                    })}

                    <div className="absolute bottom-4 left-4 flex gap-3">
                      {[
                        { label: 'Active', color: '#4ade80' },
                        { label: 'Inactive', color: '#f59e0b' },
                        { label: 'Pending', color: '#6b7280' },
                      ].map((l) => (
                        <div key={l.label} className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                          <span className="text-white text-xs">{l.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2">
                      <div className="text-white text-xs">
                        <span className="text-brand-orange font-bold text-lg">{fleet.length}</span>
                        <span className="ml-1 text-white/60">total tracked</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: 'System Uptime', value: '99.97%', sub: 'Last 30 days', icon: <Activity className="w-5 h-5 text-emerald-500" /> },
                    { label: 'API Latency', value: '42ms', sub: 'Average response', icon: <Zap className="w-5 h-5 text-brand-orange" /> },
                    { label: 'Fraud Detected', value: '0', sub: 'This month', icon: <Shield className="w-5 h-5 text-blue-500" /> },
                  ].map((s) => (
                    <div key={s.label} className="stat-card flex items-center gap-4">
                      <div className="bg-gray-50 p-3 rounded-xl">{s.icon}</div>
                      <div>
                        <p className="text-xs text-gray-500">{s.label}</p>
                        <p className="text-2xl font-bold text-brand-charcoal">{s.value}</p>
                        <p className="text-xs text-gray-400">{s.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Vehicle Documents Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-brand-charcoal text-lg">Documents: {selectedVehicle.plate_number}</h3>
              <button onClick={() => setSelectedVehicle(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              {vehicleDocs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-charcoal">{doc.doc_type}</p>
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-orange hover:underline">View file</a>
                  </div>
                  <span className={`text-xs ${doc.verified ? 'badge-success' : 'badge-warning'}`}>{doc.verified ? 'Verified' : 'Pending'}</span>
                  {!doc.verified && (
                    <button onClick={() => handleVerifyDoc(doc.id)} className="text-xs bg-brand-charcoal text-white px-3 py-1.5 rounded-lg hover:bg-brand-orange transition-colors">
                      Verify
                    </button>
                  )}
                </div>
              ))}
              {vehicleDocs.length === 0 && <p className="text-sm text-gray-400">No documents uploaded.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
