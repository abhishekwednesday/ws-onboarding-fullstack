"use server"

import { headers } from "next/headers"

import { auth } from "@/lib/auth/auth"
import { type ActionState, withActionHandler } from "@/lib/utils/action-handler"
import { type LoginFormDataType, type RegisterFormDataType } from "../types/auth-types"

export async function loginAction(data: LoginFormDataType): Promise<ActionState<unknown>> {
  return withActionHandler(async () => {
    return auth.api.signInEmail({
      body: data,
      headers: await headers(),
    })
  }, "Failed to sign in")
}

export async function registerAction(data: RegisterFormDataType): Promise<ActionState<unknown>> {
  return withActionHandler(async () => {
    return auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      headers: await headers(),
    })
  }, "Failed to create account")
}

export async function logoutAction(): Promise<ActionState<unknown>> {
  return withActionHandler(async () => {
    await auth.api.signOut({
      headers: await headers(),
    })
    return null
  }, "Failed to sign out")
}
