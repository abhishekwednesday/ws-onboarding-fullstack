import Aurora from "@/components/backgrounds/Aurora"
import { LoginForm } from "@/features/auth/components/LoginForm"

export const metadata = {
  title: "Sign In",
  description: "Sign in to your account.",
}

export default function LoginPage() {
  return (
    <>
      {/* Background decoration - React Bits Aurora */}
      <div className="pointer-events-none fixed inset-0 -z-10 h-[100dvh] w-screen">
        <div className="absolute inset-0 opacity-30 sm:opacity-40">
          <Aurora colorStops={["#2DD4BF", "#3B82F6", "#8B5CF6"]} speed={0.5} />
        </div>
        <div className="from-background to-background/80 absolute inset-0 bg-gradient-to-t via-transparent" />
      </div>

      <div className="relative flex min-h-[calc(100dvh-7rem)] flex-col items-center justify-center p-4 sm:px-6 lg:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 relative z-10 w-full max-w-md space-y-8 duration-700">
          <LoginForm />
        </div>
      </div>
    </>
  )
}
