"use client"

import { useTransition } from "react"
import { loginAction, logoutAction, registerAction } from "../api/auth-actions"
import { type LoginFormData, type RegisterFormData } from "../types/auth-types"

/**
 * React Hook for handling authentication state via Server Actions.
 * Provides login, register, logout functions and exposes an isPending state
 * for UI loading indicators.
 */
export function useAuth() {
  const [isPending, startTransition] = useTransition()

  const login = (data: LoginFormData, redirectTo = "/", onError?: (msg: string) => void) => {
    startTransition(async () => {
      const res = await loginAction(data)
      if (res.success) {
        // Force a hard navigation so the better-auth client state (useSession) re-initializes with the new cookie
        window.location.href = redirectTo
      } else {
        if (onError) onError(res.error)
      }
    })
  }

  const register = (data: RegisterFormData, redirectTo = "/", onError?: (msg: string) => void) => {
    startTransition(async () => {
      const res = await registerAction(data)
      if (res.success) {
        window.location.href = redirectTo
      } else {
        if (onError) onError(res.error)
      }
    })
  }

  const logout = () => {
    startTransition(async () => {
      const res = await logoutAction()
      if (res.success) {
        window.location.href = "/"
      }
    })
  }

  return {
    login,
    register,
    logout,
    isPending,
  }
}
