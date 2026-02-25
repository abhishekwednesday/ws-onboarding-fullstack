"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { type LoginFormData, type RegisterFormData } from "../types/auth-types"

type ActionState<T> = { success: true; data: T } | { success: false; error: string }

export async function loginAction(data: LoginFormData): Promise<ActionState<unknown>> {
  try {
    const res = await auth.api.signInEmail({
      body: data,
      headers: await headers(),
    })
    return { success: true, data: res }
  } catch (err: unknown) {
    const error = err as { body?: { message?: string }; message?: string }
    // Better auth throws APIError objects
    const message = error?.body?.message || error?.message || "Failed to sign in"
    return { success: false, error: message }
  }
}

export async function registerAction(data: RegisterFormData): Promise<ActionState<unknown>> {
  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      headers: await headers(),
    })
    return { success: true, data: res }
  } catch (err: unknown) {
    const error = err as { body?: { message?: string }; message?: string }
    const message = error?.body?.message || error?.message || "Failed to create account"
    return { success: false, error: message }
  }
}

export async function logoutAction(): Promise<ActionState<unknown>> {
  try {
    await auth.api.signOut({
      headers: await headers(),
    })
    return { success: true, data: null }
  } catch (err: unknown) {
    const error = err as { body?: { message?: string }; message?: string }
    const message = error?.body?.message || error?.message || "Failed to sign out"
    return { success: false, error: message }
  }
}
