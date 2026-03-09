"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Lock, Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "../hooks/useAuth"
import { type LoginFormDataType, LoginSchema } from "../types/auth-types"

export function LoginForm() {
  const { login, isPending } = useAuth()
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormDataType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: LoginFormDataType) => {
    setError("")
    login(data, "/playlists", (errMs) => setError(errMs))
  }

  return (
    <Card className="glass-card border-border/40 mx-auto w-full max-w-md overflow-hidden rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
      <CardHeader className="space-y-1 pt-8 pb-8">
        <CardTitle className="text-foreground text-center font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome back
        </CardTitle>
        <CardDescription className="text-muted-foreground text-center text-base">
          Enter your email and password to sign in
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
              <Input
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className="focus-visible:ring-primary/50 border-border/40 bg-background/40 h-14 rounded-xl pl-12 text-base backdrop-blur-sm transition-all"
                disabled={isPending}
              />
            </div>
            {errors.email && <p className="text-destructive text-sm font-medium">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Lock className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
              <Input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="focus-visible:ring-primary/50 border-border/40 bg-background/40 h-14 rounded-xl pl-12 text-base backdrop-blur-sm transition-all"
                disabled={isPending}
              />
            </div>
            {errors.password && <p className="text-destructive text-sm font-medium">{errors.password.message}</p>}
          </div>
          {error && <p className="text-destructive text-sm font-medium">{error}</p>}
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25 mt-2 h-14 w-full rounded-xl text-[15px] font-bold tracking-wide shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="border-border/20 bg-muted/10 flex justify-center border-t py-6">
        <p className="text-muted-foreground text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-foreground hover:text-primary font-bold underline underline-offset-4 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
