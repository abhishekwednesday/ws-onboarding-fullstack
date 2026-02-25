import { LoginForm } from "@/features/auth/components/LoginForm"

export const metadata = {
  title: "Sign In",
  description: "Sign in to your account.",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 sm:px-6 lg:px-8">
      <div className="animate-in fade-in slide-in-from-bottom-4 w-full max-w-md space-y-8 duration-500">
        <LoginForm />
      </div>
    </div>
  )
}
