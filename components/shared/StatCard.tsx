'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: number
  icon: React.ReactNode
  iconBg?: string
  prefix?: string
  isCurrency?: boolean
  delay?: number
}

export default function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconBg = 'bg-brand-orange/10',
  prefix,
  isCurrency = false,
  delay = 0,
}: StatCardProps) {
  const displayValue = isCurrency && typeof value === 'number'
    ? formatCurrency(value)
    : `${prefix || ''}${typeof value === 'number' ? value.toLocaleString() : value}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="stat-card"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-brand-charcoal">{displayValue}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend >= 0
                ? <TrendingUp className="w-3.5 h-3.5" />
                : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{Math.abs(trend)}% vs last period</span>
            </div>
          )}
        </div>
        <div className={`${iconBg} p-3 rounded-xl`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}
