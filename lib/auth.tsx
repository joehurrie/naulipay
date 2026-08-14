'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authApi, clearToken, setToken } from './api'
import type { UserOut, Role } from './types'

interface AuthState {
  user: UserOut | null
  token: string | null
  isLoading: boolean
  error: string | null
}

interface AuthContextValue extends AuthState {
  requestOtp: (phone: string, fullName?: string, role?: Role) => Promise<{ detail: string; expires_in: number }>
  verifyOtp: (phone: string, code: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'np_token'
const USER_KEY = 'np_user'

function normalizePhone(phone: string): string {
  let p = phone.trim().replace(/\s+/g, '').replace(/^\+/, '')
  if (p.startsWith('0')) p = '254' + p.slice(1)
  if (p.startsWith('7')) p = '254' + p
  if (p.startsWith('1')) p = '254' + p
  return p
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserOut | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Restore from localStorage on mount (client only)
  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEY)
    const savedUser = localStorage.getItem(USER_KEY)
    if (savedToken && savedUser) {
      try {
        setTokenState(savedToken)
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  // Keep API token helper in sync
  useEffect(() => {
    if (token) {
      setToken(token)
    } else {
      clearToken()
    }
  }, [token])

  const requestOtp = useCallback(
    async (phone: string, fullName?: string, role?: Role) => {
      setError(null)
      const res = await authApi.requestOtp({
        phone_number: normalizePhone(phone),
        full_name: fullName || null,
        role,
      })
      return res
    },
    []
  )

  const verifyOtp = useCallback(
    async (phone: string, code: string) => {
      setError(null)
      setIsLoading(true)
      try {
        const res = await authApi.verifyOtp({
          phone_number: normalizePhone(phone),
          code,
        })
        const { access_token, user } = res
        localStorage.setItem(STORAGE_KEY, access_token)
        localStorage.setItem(USER_KEY, JSON.stringify(user))
        setTokenState(access_token)
        setUser(user)

        if (user.role === 'admin') router.push('/admin')
        else if (user.role === 'owner') router.push('/owner')
        else router.push('/commuter')
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Verification failed'
        setError(msg)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(USER_KEY)
    setTokenState(null)
    setUser(null)
    clearToken()
    router.push('/login')
  }, [router])

  const clearError = useCallback(() => setError(null), [])

  // Redirect unauthenticated users away from protected dashboards
  useEffect(() => {
    if (isLoading) return
    const protectedPaths = ['/commuter', '/owner', '/admin']
    if (!user && protectedPaths.some((p) => pathname?.startsWith(p))) {
      router.push('/login')
    }
  }, [isLoading, user, pathname, router])

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    error,
    requestOtp,
    verifyOtp,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { normalizePhone }
