import { ResetPasswordForm } from "@/components/reset-password-form"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
