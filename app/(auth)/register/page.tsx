import { RegisterForm } from "@/features/auth/components/RegisterForm"

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 sm:px-6 lg:px-8">
      <div className="animate-in fade-in slide-in-from-bottom-4 w-full max-w-md space-y-8 duration-500">
        <RegisterForm />
      </div>
    </div>
  )
}
