"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTranslation } from "@/lib/language-context"
import { useToast } from "@/components/ui/use-toast"
import { acceptRoomInvite } from "@/app/actions/room"
import { Loader2, CheckCircle2, XCircle, ShieldCheck, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InvitePage() {
  const { roomId, token } = useParams()
  const router = useRouter()
  const { t } = useTranslation()
  const { toast } = useToast()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAcceptInvite = async () => {
      if (!roomId || !token) return

      try {
        const result = await acceptRoomInvite(roomId as string, token as string)
        
        if (result.success) {
          setStatus("success")
          toast({
            title: t('roomSettings.inviteSuccess'),
            variant: "default",
          })
          // Redirect to the room after 2 seconds
          setTimeout(() => {
            router.push(`/dashboard/rooms/${roomId}`)
          }, 2000)
        } else {
          setStatus("error")
          setError(result.error || t('roomSettings.invalidInvite'))
        }
      } catch (err) {
        setStatus("error")
        setError(t('sidebar.unexpectedError'))
      }
    }

    handleAcceptInvite()
  }, [roomId, token, router, t, toast])

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[25%] -right-[10%] w-[70%] h-[70%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md bg-[#0F172A] border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden">
        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600" />

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Logo/Icon Area */}
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full" />
            <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg border border-white/20">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              GOLDEN RUSSIA
            </h1>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">
              Elite Business Network
            </p>
          </div>

          {/* Status Content */}
          <div className="w-full py-8 space-y-6">
            {status === "loading" && (
              <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-500">
                <div className="relative">
                  <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
                  <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-white">{t('roomSettings.accepting')}</p>
                  <p className="text-sm text-slate-500">{t('common.loading')}</p>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center space-y-4 animate-in zoom-in fade-in duration-500">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-white">{t('roomSettings.inviteSuccess')}</p>
                  <p className="text-sm text-slate-500">{t('roomSettings.joining')}</p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center space-y-6 animate-in zoom-in fade-in duration-500">
                <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                  <XCircle className="h-8 w-8 text-rose-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-white">{t('common.error')}</p>
                  <p className="text-sm text-rose-400/80 font-medium">{error}</p>
                </div>
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="w-full h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-all"
                >
                  {t('dashboard.openMenu')}
                </Button>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="pt-4 border-t border-white/5 w-full">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              Secure Invitation System v1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
