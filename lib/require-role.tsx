'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth'
import type { Role } from './types'

// Same role -> dashboard mapping auth.tsx's verifyOtp() redirects to on
// login — kept in one place so a role change never has two different
// ideas of where that role "lives".
export const DASHBOARD_PATH: Record<Role, string> = {
  admin: '/admin',
  owner: '/owner',
  commuter: '/commuter',
  driver: '/commuter', // drivers have no dedicated dashboard yet
}

/** Guards a dashboard page against being viewed by the wrong role — e.g. a
 * commuter navigating straight to /admin. Redirects to /login if signed
 * out, or to the user's own dashboard if their role doesn't match `role`.
 * Render nothing (or a loader) while `isReady` is false so the page's real
 * content never flashes for an unauthorized viewer. */
export function useRequireRole(role: Role) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.push('/login')
      return
    }
    if (user.role !== role) {
      router.push(DASHBOARD_PATH[user.role])
    }
  }, [isLoading, user, role, router])

  return { user, isReady: !isLoading && !!user && user.role === role }
}
