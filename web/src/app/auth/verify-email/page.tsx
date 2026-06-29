import Link from "next/link"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { verifyEmailToken } from "@/app/actions/auth"
import { ChinaRussiaBackground } from "@/components/china-russia-background"

const messages = {
  success: {
    title: "Email подтверждён",
    description: "Теперь вы можете войти в аккаунт Golden Russia.",
    tone: "text-emerald-400",
    icon: CheckCircle2,
  },
  verificationExpired: {
    title: "Ссылка истекла",
    description: "Срок действия ссылки подтверждения истёк. Зарегистрируйтесь повторно или обратитесь к администратору.",
    tone: "text-amber-400",
    icon: AlertCircle,
  },
  verificationInvalid: {
    title: "Ссылка недействительна",
    description: "Мы не смогли подтвердить email по этой ссылке. Проверьте, что ссылка скопирована полностью.",
    tone: "text-red-400",
    icon: AlertCircle,
  },
}

export default async function VerifyEmailPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const token = typeof searchParams.token === "string" ? searchParams.token : ""
  const result = await verifyEmailToken(token)
  const message = "success" in result
    ? messages.success
    : messages[result.error as keyof typeof messages] || messages.verificationInvalid
  const Icon = message.icon

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0d1117] relative p-4">
      <ChinaRussiaBackground />
      <section className="relative z-10 w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 space-y-8 text-center">
        <div className="space-y-4">
          <Icon className={`h-14 w-14 mx-auto ${message.tone}`} />
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight">{message.title}</h1>
            <p className="text-slate-400 font-light text-sm md:text-base">{message.description}</p>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex w-full h-12 md:h-14 items-center justify-center rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold shadow-xl shadow-amber-500/20 transition-all duration-300"
        >
          Перейти ко входу
        </Link>
      </section>
    </main>
  )
}
