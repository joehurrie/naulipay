'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  TrendingUp, Truck, Bell, DollarSign, Users, Activity,
  CheckCircle, Clock, Zap, Settings, Home, LayoutDashboard,
  Landmark, ArrowUpRight, LogOut, ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import { mockVehicles, earningsData, vehicleEmojis, vehicleLabels, type VehicleType } from '@/lib/mock-data'
import { formatCurrency, formatDateTime, getInitials } from '@/lib/utils'

type Tab = 'overview' | 'fleet' | 'earnings' | 'credit'
type Period = 'daily' | 'weekly' | 'monthly'

const ownerName = 'Joseph Kamau'

const notifications = [
  { id: 1, text: 'KBZ 234G — Payment received: KES 70', time: '2 min ago', type: 'payment' },
  { id: 2, text: 'KBX 101F — Trip completed: KES 80', time: '8 min ago', type: 'payment' },
  { id: 3, text: 'KCY 876M — New booking confirmed', time: '15 min ago', type: 'booking' },
  { id: 4, text: 'Payout of KES 12,000 processed', time: '2 hours ago', type: 'payout' },
  { id: 5, text: 'KCM 320H went offline', time: '3 hours ago', type: 'alert' },
]

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [period, setPeriod] = useState<Period>('daily')

  const totalEarnings = mockVehicles.reduce((s, v) => s + v.earnings, 0)
  const activeVehicles = mockVehicles.filter(v => v.status === 'active').length
  const data = earningsData[period]
  const periodEarnings = data.reduce((s, d) => s + d.earnings, 0)

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'fleet', label: 'Fleet', icon: <Truck className="w-4 h-4" /> },
    { id: 'earnings', label: 'Earnings', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'credit', label: 'Credit', icon: <Landmark className="w-4 h-4" /> },
  ]

  const statusColor: Record<string, string> = {
    active: 'badge-success',
    idle: 'badge-warning',
    offline: 'badge text-gray-400 bg-gray-100',
  }

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
              <p className="text-gray-400 text-xs">{mockVehicles.length} vehicles registered</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
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
          <Link href="/" className="sidebar-nav-item sidebar-nav-inactive w-full">
            <Home className="w-4 h-4" /> Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Header */}
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
                {/* KPIs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Earnings', value: formatCurrency(totalEarnings), icon: <DollarSign className="w-4 h-4 text-brand-orange" />, trend: '+12%' },
                    { label: 'Active Vehicles', value: `${activeVehicles} / ${mockVehicles.length}`, icon: <Truck className="w-4 h-4 text-blue-500" />, trend: '' },
                    { label: "Today's Revenue", value: 'KES 8,450', icon: <TrendingUp className="w-4 h-4 text-emerald-500" />, trend: '+8%' },
                    { label: 'Platform Fee', value: '8%', icon: <Activity className="w-4 h-4 text-purple-500" />, trend: '' },
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

                {/* Quick Chart + Notifications */}
                <div className="grid lg:grid-cols-3 gap-5">
                  {/* Mini Chart */}
                  <div className="lg:col-span-2 card-white p-5">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-semibold text-brand-charcoal">Weekly Earnings</h3>
                      <span className="badge-success text-xs">+12.4% MoM</span>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={earningsData.daily}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
                        <Tooltip
                          formatter={(v: number) => [formatCurrency(v), 'Earnings']}
                          contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="earnings" fill="#FF6B00" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Notifications */}
                  <div className="card-white p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-brand-charcoal">Live Feed</h3>
                      <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-3 overflow-y-auto max-h-56 no-scrollbar">
                      {notifications.map(n => (
                        <div key={n.id} className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                            n.type === 'payment' ? 'bg-emerald-100 text-emerald-600' :
                            n.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                            n.type === 'payout' ? 'bg-brand-orange/10 text-brand-orange' :
                            'bg-red-100 text-red-500'
                          }`}>
                            {n.type === 'payment' ? '💳' : n.type === 'booking' ? '📍' : n.type === 'payout' ? '💰' : '⚠️'}
                          </div>
                          <div>
                            <p className="text-xs text-gray-700 leading-snug">{n.text}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fleet Status */}
                <div className="card-white p-5">
                  <h3 className="font-semibold text-brand-charcoal mb-4">Fleet Status</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {mockVehicles.map(v => (
                      <div key={v.id} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                        <span className="text-2xl">{vehicleEmojis[v.type]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-brand-charcoal text-sm">{v.plate}</p>
                          <p className="text-gray-400 text-xs truncate">{v.currentRoute}</p>
                        </div>
                        <span className={`text-xs ${statusColor[v.status]}`}>{v.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'fleet' && (
              <motion.div key="fleet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="card-white overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-brand-charcoal">Registered Vehicles</h3>
                      <p className="text-gray-400 text-sm">{mockVehicles.length} vehicles in fleet</p>
                    </div>
                    <button id="add-vehicle-btn" className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5" /> Register Vehicle
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Vehicle</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Driver</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Route</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Passengers</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Earnings</th>
                          <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {mockVehicles.map(v => (
                          <tr key={v.id} className="table-row-hover">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{vehicleEmojis[v.type]}</span>
                                <div>
                                  <p className="font-semibold text-brand-charcoal">{v.plate}</p>
                                  <p className="text-gray-400 text-xs capitalize">{vehicleLabels[v.type]}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-gray-700">{v.driver}</td>
                            <td className="px-5 py-4 text-gray-500 text-xs max-w-[160px] truncate">{v.currentRoute}</td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full max-w-[60px]">
                                  <div className="h-full bg-brand-orange rounded-full" style={{ width: `${(v.passengers / v.capacity) * 100}%` }} />
                                </div>
                                <span className="text-gray-500 text-xs">{v.passengers}/{v.capacity}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 font-semibold text-brand-charcoal">{formatCurrency(v.earnings)}</td>
                            <td className="px-5 py-4">
                              <span className={`text-xs ${statusColor[v.status]}`}>{v.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'earnings' && (
              <motion.div key="earnings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                {/* Period Tabs */}
                <div className="flex gap-2">
                  {(['daily', 'weekly', 'monthly'] as Period[]).map(p => (
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

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: `${period.charAt(0).toUpperCase() + period.slice(1)} Total`, value: formatCurrency(periodEarnings) },
                    { label: 'Platform Fee (8%)', value: formatCurrency(periodEarnings * 0.08) },
                    { label: 'Net Earnings', value: formatCurrency(periodEarnings * 0.92) },
                  ].map((s, i) => (
                    <div key={s.label} className={`stat-card ${i === 2 ? 'border-brand-orange/20 bg-orange-50' : ''}`}>
                      <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                      <p className={`text-xl font-bold ${i === 2 ? 'text-brand-orange' : 'text-brand-charcoal'}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Full Chart */}
                <div className="card-white p-6">
                  <h3 className="font-semibold text-brand-charcoal mb-5">Earnings Breakdown</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(v: number) => [formatCurrency(v), 'Earnings']}
                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="earnings" fill="#FF6B00" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {activeTab === 'credit' && (
              <motion.div key="credit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                {/* Credit Score Card */}
                <div className="bg-brand-charcoal rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/10 rounded-full blur-3xl" />
                  <div className="relative">
                    <p className="text-white/60 text-sm mb-4">Credit Score</p>
                    <div className="flex items-end gap-4 mb-4">
                      <span className="text-white text-6xl font-black">724</span>
                      <div className="mb-2">
                        <span className="badge bg-emerald-500/20 text-emerald-400 text-sm font-semibold">Good</span>
                        <p className="text-white/40 text-xs mt-1">Top 35% of platform users</p>
                      </div>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full mb-4">
                      <div className="h-full bg-gradient-to-r from-brand-orange to-emerald-400 rounded-full" style={{ width: '72%' }} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Trip History', score: '98%', color: 'text-emerald-400' },
                        { label: 'Platform Tenure', score: '85%', color: 'text-blue-400' },
                        { label: 'Repayment', score: '100%', color: 'text-emerald-400' },
                      ].map(s => (
                        <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                          <p className={`font-bold ${s.color}`}>{s.score}</p>
                          <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Available Credit */}
                <div className="card-white p-5">
                  <h3 className="font-semibold text-brand-charcoal mb-4">Available Credit Lines</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Working Capital Loan', limit: 'KES 150,000', rate: '2.5% / month', status: 'eligible', icon: '💼' },
                      { name: 'Fleet Expansion Credit', limit: 'KES 500,000', rate: '1.8% / month', status: 'eligible', icon: '🚌' },
                      { name: 'Emergency Fund', limit: 'KES 30,000', rate: '3.0% / month', status: 'active', icon: '⚡' },
                    ].map(credit => (
                      <div key={credit.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <span className="text-2xl">{credit.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-brand-charcoal text-sm">{credit.name}</p>
                          <p className="text-gray-400 text-xs">{credit.limit} limit · {credit.rate}</p>
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

                {/* Payout */}
                <div className="card-white p-5">
                  <h3 className="font-semibold text-brand-charcoal mb-4">Request Payout</h3>
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-gray-500 text-sm">Available for withdrawal</p>
                    <p className="text-3xl font-black text-brand-charcoal mt-1">{formatCurrency(totalEarnings * 0.92)}</p>
                  </div>
                  <div className="flex gap-3">
                    <button id="payout-mpesa-btn" className="flex-1 btn-primary py-3 text-sm">📱 M-Pesa Withdrawal</button>
                    <button id="payout-bank-btn" className="flex-1 btn-secondary py-3 text-sm">🏦 Bank Transfer</button>
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
