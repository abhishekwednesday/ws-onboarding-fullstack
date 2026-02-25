"use client"

import { Loader2, Lock, Mail, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "../hooks/useAuth"

export function RegisterForm() {
  const { register, isPending } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!name || !email || !password) {
      setError("Please fill in all fields")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    // Server action register hook wrapper
    register({ name, email, password }, "/", (errMs) => setError(errMs))
  }

  return (
    <Card className="bg-background/60 mx-auto w-full max-w-md border-white/10 shadow-xl backdrop-blur-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold tracking-tight">Create an account</CardTitle>
        <CardDescription className="text-muted-foreground text-center">
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <User className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="focus-visible:ring-primary/50 border-white/10 bg-white/5 pl-10 transition-colors"
                disabled={isPending}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus-visible:ring-primary/50 border-white/10 bg-white/5 pl-10 transition-colors"
                disabled={isPending}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus-visible:ring-primary/50 border-white/10 bg-white/5 pl-10 transition-colors"
                disabled={isPending}
                required
                minLength={8}
              />
            </div>
          </div>
          {error && <p className="text-destructive text-sm font-medium">{error}</p>}
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 w-full font-semibold transition-all"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-white/5 pt-4">
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
