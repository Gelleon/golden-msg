import { ResetPasswordForm } from "@/components/reset-password-form"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { validateResetToken } from "@/app/actions/auth"

export default async function ResetPasswordPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const token = typeof searchParams.token === 'string' ? searchParams.token : undefined;
  
  console.log(`[RESET_PAGE] Received token: ${token ? token.substring(0, 10) + '...' : 'NONE'}`);
  
  let validationError = null;
  if (token) {
    const result = await validateResetToken(token);
    if (result.error) {
      validationError = result.error;
    }
  } else {
    validationError = "welcome.recovery.errorTokenInvalid";
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
      </div>
    }>
      <ResetPasswordForm initialError={validationError} isValid={!validationError} />
    </Suspense>
  )
}
