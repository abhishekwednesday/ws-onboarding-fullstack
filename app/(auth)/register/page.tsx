import { AuthLayout } from "@/components/layout/AuthLayout"
import { RegisterForm } from "@/features/auth/components/RegisterForm"

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
}

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  )
}
