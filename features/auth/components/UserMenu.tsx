"use client"

import { LogOut, User } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "@/lib/auth/auth-client"
import { useAuth } from "../hooks/useAuth"

export function UserMenu() {
  const { data: session, isPending } = useSession()
  const { logout } = useAuth()

  if (isPending) {
    return <div className="bg-muted h-9 w-9 animate-pulse rounded-full" />
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hidden sm:inline-flex"
          >
            Log in
          </Button>
        </Link>
        <Link href="/register">
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 group overflow-hidden rounded-full px-4 font-semibold shadow-sm"
          >
            <span className="relative z-10 inline-block transition-transform group-hover:scale-105">Sign up</span>
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="border-border bg-muted/50 hover:bg-accent relative h-9 w-9 rounded-full border transition-colors"
        >
          <User className="text-muted-foreground h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{session.user.name}</p>
            <p className="text-muted-foreground truncate text-xs leading-none">{session.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive group cursor-pointer"
          onClick={() => logout((msg) => toast.error(msg))}
        >
          <LogOut className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
