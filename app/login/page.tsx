'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, KeyRound, User, ChevronRight, Zap, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import type { Role } from '@/lib/types'

export default function LoginPage() {
  const { requestOtp, verifyOtp, isLoading, error, clearError } = useAuth()
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phone, setPhone] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<Role>('commuter')
  const [code, setCode] = useState('')
  const [otpMsg, setOtpMsg] = useState('')

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    try {
      const res = await requestOtp(phone, fullName || undefined, role)
      setOtpMsg(res.detail)
      setStep('code')
    } catch {
      // error handled by auth context
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    try {
      await verifyOtp(phone, code)
    } catch {
      // error handled by auth context
    }
  }

  return (
    <main className="min-h-screen bg-brand-charcoal flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative z-10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <span className="text-brand-charcoal font-bold text-xl">
            nauli<span className="text-brand-orange">pass</span>
          </span>
        </Link>

        <h1 className="text-2xl font-bold text-brand-charcoal text-center mb-2">
          {step === 'phone' ? 'Sign in with phone' : 'Enter verification code'}
        </h1>
        <p className="text-gray-400 text-center text-sm mb-8">
          {step === 'phone'
            ? 'We\'ll send a one-time password to your Kenyan mobile number.'
            : `We sent a 6-digit code to ${phone}`}
        </p>

        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.form
              key="phone"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleRequestOtp}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Phone number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XX XXX XXX"
                    className="input-light pl-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Full name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="New users only"
                    className="input-light pl-12"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Required only when creating a new account.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Account type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['commuter', 'owner', 'admin'] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 rounded-xl text-sm font-medium capitalize transition-all border ${
                        role === r
                          ? 'bg-brand-orange text-white border-brand-orange'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-orange/40'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2.5 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="code"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerify}
              className="space-y-5"
            >
              {otpMsg && (
                <div className="text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl text-sm text-center">
                  {otpMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Verification code</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="input-light pl-12 tracking-[0.3em] font-semibold"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2.5 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || code.length < 4}
                className="w-full btn-primary py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-center text-sm text-gray-500 hover:text-brand-orange transition-colors"
              >
                Use a different number
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-xs text-gray-400 text-center mt-6">
          By continuing, you agree to receive an SMS for authentication.
        </p>
      </motion.div>
    </main>
  )
}
