'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart
} from 'recharts'
import {
  Users, Truck, DollarSign, Activity, Shield, Search, CheckCircle,
  XCircle, Clock, Zap, Settings, LayoutDashboard, MapPin, CreditCard,
  AlertTriangle, ChevronDown, LogOut, FileText, BarChart2
} from 'lucide-react'
import Link from 'next/link'
import {
  allUsers, allTransactions, mockVehicles, pendingVehicles,
  earningsData, vehicleEmojis, vehicleLabels, type VehicleType
} from '@/lib/mock-data'
import { formatCurrency, formatDateTime, formatDate, getInitials } from '@/lib/utils'

type Tab = 'overview' | 'users' | 'transactions' | 'vehicles' | 'telemetry'

const systemMetrics = [
  { day: 'Mon', transactions: 342, revenue: 28400, users: 812 },
  { day: 'Tue', transactions: 418, revenue: 34100, users: 954 },
  { day: 'Wed', transactions: 385, revenue: 31800, users: 876 },
  { day: 'Thu', transactions: 512, revenue: 42000, users: 1102 },
  { day: 'Fri', transactions: 678, revenue: 55200, users: 1450 },
  { day: 'Sat', transactions: 740, revenue: 61000, users: 1620 },
  { day: 'Sun', transactions: 498, revenue: 41500, users: 1100 },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [txFilter, setTxFilter] = useState('all')

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.cardId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTx = allTransactions.filter(tx =>
    txFilter === 'all' || tx.type === txFilter
  )

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'users', label: 'User Ledger', icon: <Users className="w-4 h-4" /> },
    { id: 'transactions', label: 'Transactions', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'vehicles', label: 'Fleet Approval', icon: <Truck className="w-4 h-4" /> },
    { id: 'telemetry', label: 'Telemetry', icon: <Activity className="w-4 h-4" /> },
  ]

  const statusBadge = (status: string) => {
    if (status === 'completed') return <span className="badge-success text-xs">Completed</span>
    if (status === 'pending') return <span className="badge-warning text-xs">Pending</span>
    if (status === 'failed') return <span className="badge-error text-xs">Failed</span>
    return null
  }

  const txTypeBadge = (type: string) => {
    const map: Record<string, string> = {
      fare: 'badge-info',
      commission: 'badge-orange',
      credit: 'badge-warning',
      payout: 'badge-success',
    }
    return <span className={`badge ${map[type] || 'badge'} text-xs capitalize`}>{type}</span>
  }

  return (
    <div className="min-h-screen bg-brand-neutral flex">
      {/* Sidebar */}
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
            <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-sm">SA</div>
            <div>
              <p className="font-semibold text-white text-sm">Super Admin</p>
              <p className="text-white/40 text-xs">Full system access</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
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
          <Link href="/commuter" className="sidebar-nav-item text-white/60 hover:bg-white/10 hover:text-white w-full">
            <Users className="w-4 h-4" /> Commuter App
          </Link>
          <Link href="/owner" className="sidebar-nav-item text-white/60 hover:bg-white/10 hover:text-white w-full">
            <Truck className="w-4 h-4" /> Owner Portal
          </Link>
          <Link href="/" className="sidebar-nav-item text-white/60 hover:bg-white/10 hover:text-white w-full">
            <LogOut className="w-4 h-4" /> Back to Site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Header */}
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
              <div className="w-8 h-8 bg-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-xs">SA</div>
            </div>
          </div>

          {/* Mobile nav */}
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

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Users', value: allUsers.length.toLocaleString(), sub: '↑ 142 this week', icon: <Users className="w-5 h-5" />, color: 'bg-blue-500/10 text-blue-600' },
                    { label: 'Active Vehicles', value: `${mockVehicles.filter(v => v.status === 'active').length}`, sub: `${mockVehicles.length} registered total`, icon: <Truck className="w-5 h-5" />, color: 'bg-emerald-500/10 text-emerald-600' },
                    { label: "Today's Revenue", value: 'KES 55,200', sub: '+18% vs yesterday', icon: <DollarSign className="w-5 h-5" />, color: 'bg-brand-orange/10 text-brand-orange' },
                    { label: 'Platform Commission', value: 'KES 4,416', sub: '8% of transactions', icon: <Activity className="w-5 h-5" />, color: 'bg-purple-500/10 text-purple-600' },
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

                {/* Charts row */}
                <div className="grid lg:grid-cols-2 gap-5">
                  {/* Transactions Chart */}
                  <div className="card-white p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-brand-charcoal">Daily Transactions</h3>
                      <span className="text-xs text-gray-400">This week</span>
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

                  {/* Revenue Chart */}
                  <div className="card-white p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-brand-charcoal">Revenue (KES)</h3>
                      <span className="badge-success text-xs">+22% MoM</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={systemMetrics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
                        <Tooltip
                          formatter={(v: number) => [formatCurrency(v), 'Revenue']}
                          contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="revenue" fill="#1A1D20" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Alerts */}
                <div className="card-white p-5">
                  <h3 className="font-semibold text-brand-charcoal mb-3">System Alerts</h3>
                  <div className="space-y-2">
                    {[
                      { msg: '2 vehicles pending registration approval', level: 'warning', icon: <Truck className="w-4 h-4" /> },
                      { msg: '1 failed transaction requires manual review (TXN-001240)', level: 'error', icon: <AlertTriangle className="w-4 h-4" /> },
                      { msg: 'KES 12,000 payout processed successfully to Lucia Wambua', level: 'success', icon: <CheckCircle className="w-4 h-4" /> },
                    ].map((alert, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
                        alert.level === 'warning' ? 'bg-amber-50 text-amber-700' :
                        alert.level === 'error' ? 'bg-red-50 text-red-600' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {alert.icon}
                        <span>{alert.msg}</span>
                      </div>
                    ))}
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
                        <p className="text-gray-400 text-sm">{allUsers.length} registered users</p>
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          id="user-search"
                          type="text"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
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
                        {filteredUsers.map(user => (
                          <tr key={user.id} className="table-row-hover">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-brand-orange/10 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold">
                                  {getInitials(user.name)}
                                </div>
                                <div>
                                  <p className="font-medium text-brand-charcoal">{user.name}</p>
                                  <p className="text-gray-400 text-xs">{user.phone}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{user.id}</td>
                            <td className="px-5 py-3.5 font-mono text-xs text-blue-600">{user.cardId}</td>
                            <td className="px-5 py-3.5 font-semibold">{user.totalTrips}</td>
                            <td className="px-5 py-3.5 text-yellow-600 font-medium">{user.loyaltyPoints.toLocaleString()}</td>
                            <td className="px-5 py-3.5">
                              {user.creditEligible
                                ? <span className="badge-success text-xs">Eligible</span>
                                : <span className="badge text-xs bg-gray-100 text-gray-400">Locked</span>}
                            </td>
                            <td className="px-5 py-3.5">
                              {user.status === 'active'
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
                      <div className="flex gap-2">
                        {['all', 'fare', 'commission', 'credit', 'payout'].map(f => (
                          <button
                            key={f}
                            id={`tx-filter-${f}`}
                            onClick={() => setTxFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                              txFilter === f ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {f}
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
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">User</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Amount</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Type</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Method</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Time</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredTx.map(tx => (
                          <tr key={tx.id} className="table-row-hover">
                            <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{tx.id}</td>
                            <td className="px-5 py-3.5 font-medium text-brand-charcoal">{tx.userName}</td>
                            <td className="px-5 py-3.5 font-bold text-brand-charcoal">{formatCurrency(tx.amount)}</td>
                            <td className="px-5 py-3.5">{txTypeBadge(tx.type)}</td>
                            <td className="px-5 py-3.5 text-gray-500 text-xs capitalize">{tx.paymentMethod.replace('-', ' ')}</td>
                            <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDateTime(tx.timestamp)}</td>
                            <td className="px-5 py-3.5">{statusBadge(tx.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'vehicles' && (
              <motion.div key="vehicles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                {/* Pending Queue */}
                <div className="card-white overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-brand-charcoal">Pending Approval</h3>
                      <p className="text-gray-400 text-sm">{pendingVehicles.length} vehicles awaiting verification</p>
                    </div>
                    <span className="badge-warning text-xs">{pendingVehicles.length} pending</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {pendingVehicles.map(v => (
                      <div key={v.id} className="flex items-center gap-4 px-5 py-4 table-row-hover">
                        <span className="text-2xl">{vehicleEmojis[v.type]}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-brand-charcoal">{v.plate}</p>
                          <p className="text-gray-400 text-xs">{v.owner} · Submitted {formatDate(v.submitted)}</p>
                        </div>
                        <span className="capitalize text-xs font-medium text-gray-500">{vehicleLabels[v.type]}</span>
                        <span className={`text-xs ${v.docs === 'complete' ? 'badge-success' : 'badge-warning'}`}>
                          Docs: {v.docs}
                        </span>
                        <div className="flex gap-2">
                          <button id={`approve-${v.id}`} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button id={`reject-${v.id}`} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All Vehicles */}
                <div className="card-white overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-brand-charcoal">All Registered Vehicles</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Vehicle</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Driver</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Current Route</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Capacity</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Total Earnings</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {mockVehicles.map(v => (
                          <tr key={v.id} className="table-row-hover">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{vehicleEmojis[v.type]}</span>
                                <div>
                                  <p className="font-semibold text-brand-charcoal">{v.plate}</p>
                                  <p className="text-gray-400 text-xs capitalize">{vehicleLabels[v.type]}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-gray-700">{v.driver}</td>
                            <td className="px-5 py-3.5 text-gray-500 text-xs">{v.currentRoute}</td>
                            <td className="px-5 py-3.5">
                              <span className="text-gray-600">{v.passengers}/{v.capacity}</span>
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-brand-charcoal">{formatCurrency(v.earnings)}</td>
                            <td className="px-5 py-3.5">
                              <span className={`text-xs ${
                                v.status === 'active' ? 'badge-success' :
                                v.status === 'idle' ? 'badge-warning' : 'badge text-gray-400 bg-gray-100'
                              }`}>{v.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'telemetry' && (
              <motion.div key="telemetry" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                {/* System Map */}
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

                  {/* Telemetry Map */}
                  <div className="relative h-[480px] bg-brand-charcoal overflow-hidden">
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(160deg, #1e2530 0%, #1A1D20 50%, #0f1215 100%)',
                    }}>
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

                    {/* Vehicle Pins */}
                    {mockVehicles.map((v, i) => {
                      const positions = [
                        { top: '45%', left: '55%' },
                        { top: '35%', left: '25%' },
                        { top: '55%', left: '65%' },
                        { top: '30%', left: '55%' },
                        { top: '60%', left: '35%' },
                        { top: '22%', left: '68%' },
                      ]
                      const pos = positions[i] || { top: '50%', left: '50%' }
                      const colors: Record<string, string> = { active: '#4ade80', idle: '#f59e0b', offline: '#6b7280' }
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
                            <div
                              className="absolute inset-0 rounded-full animate-ping-slow opacity-30"
                              style={{ backgroundColor: colors[v.status], transform: 'scale(2.5)' }}
                            />
                          )}
                          <div
                            className="relative w-9 h-9 rounded-full flex items-center justify-center text-sm shadow-lg z-10 cursor-pointer hover:scale-125 transition-transform duration-200"
                            style={{ backgroundColor: colors[v.status] }}
                            title={`${v.plate} — ${v.driver}`}
                          >
                            {vehicleEmojis[v.type]}
                          </div>
                          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white text-xs text-gray-800 font-medium px-2 py-0.5 rounded-full shadow whitespace-nowrap">
                            {v.plate}
                          </div>
                        </motion.div>
                      )
                    })}

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 flex gap-3">
                      {[
                        { label: 'Active', color: '#4ade80' },
                        { label: 'Idle', color: '#f59e0b' },
                        { label: 'Offline', color: '#6b7280' },
                      ].map(l => (
                        <div key={l.label} className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                          <span className="text-white text-xs">{l.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2">
                      <div className="text-white text-xs">
                        <span className="text-brand-orange font-bold text-lg">{mockVehicles.length}</span>
                        <span className="ml-1 text-white/60">total tracked</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Stats */}
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: 'System Uptime', value: '99.97%', sub: 'Last 30 days', icon: <Activity className="w-5 h-5 text-emerald-500" /> },
                    { label: 'API Latency', value: '42ms', sub: 'Average response', icon: <Zap className="w-5 h-5 text-brand-orange" /> },
                    { label: 'Fraud Detected', value: '0', sub: 'This month', icon: <Shield className="w-5 h-5 text-blue-500" /> },
                  ].map(s => (
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
    </div>
  )
}
