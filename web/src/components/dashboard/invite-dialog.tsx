"use client"

import { useState, useEffect } from "react"
import { Copy, Link, Check, UserPlus, Shield, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "@/lib/language-context"
import { createRoomInvite } from "@/app/actions/room"
import { cn } from "@/lib/utils"

interface InviteDialogProps {
  roomId: string
  userRole?: string
}

export function InviteDialog({ roomId, userRole }: InviteDialogProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"client" | "partner">("client")
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const canInvite = ["admin", "manager"].includes(userRole || "")

  if (!canInvite) return null

  const handleGenerateLink = async () => {
    console.log("Generate link clicked, roomId:", roomId, "selectedRole:", selectedRole)
    if (!roomId) {
      console.error("Missing roomId in InviteDialog")
      toast({
        title: t('common.error'),
        description: t('sidebar.unexpectedError'),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      console.log("Calling createRoomInvite...")
      const result = await createRoomInvite(roomId, selectedRole)
      console.log("Create invite response received:", result)
      
      if (result.success && result.inviteUrl) {
        setInviteUrl(result.inviteUrl)
        toast({
          title: t('settings_status.success'),
          description: t('roomSettings.inviteDialogTitle'),
        })
      } else {
        console.error("Invite creation failed:", result.error)
        toast({
          title: t('common.error'),
          description: result.error || t('roomSettings.inviteError'),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Critical error in handleGenerateLink:", error)
      toast({
        title: t('common.error'),
        description: t('sidebar.unexpectedError'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      toast({
        title: t('roomSettings.linkCopied'),
        description: t('roomSettings.linkCopiedDesc'),
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v)
      if (!v) {
        setInviteUrl(null)
        setCopied(false)
      }
    }}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-9 gap-2 text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl px-4 transition-all"
        >
          <UserPlus className="h-4 w-4" />
          <span className="font-bold text-xs uppercase tracking-wider">{t('roomSettings.invite')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-[#0F172A] border-white/10 text-white overflow-hidden rounded-3xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
        <DialogHeader className="pt-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Link className="h-5 w-5 text-amber-500" />
            {t('roomSettings.inviteDialogTitle')}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {t('roomSettings.inviteDialogDesc')}
          </DialogDescription>
        </DialogHeader>

        {!inviteUrl ? (
          <div className="space-y-6 py-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-300 uppercase tracking-widest px-1">
                {t('roomSettings.selectRole')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole("client")}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left group",
                    selectedRole === "client" 
                      ? "bg-amber-500/10 border-amber-500" 
                      : "bg-white/5 border-transparent hover:border-white/10"
                  )}
                >
                  <User className={cn(
                    "h-6 w-6 mb-2 transition-colors",
                    selectedRole === "client" ? "text-amber-500" : "text-slate-500 group-hover:text-slate-400"
                  )} />
                  <span className={cn(
                    "font-bold text-sm mb-1",
                    selectedRole === "client" ? "text-white" : "text-slate-300"
                  )}>{t('roles.client')}</span>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {t('roomSettings.roleClientDesc')}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("partner")}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left group",
                    selectedRole === "partner" 
                      ? "bg-amber-500/10 border-amber-500" 
                      : "bg-white/5 border-transparent hover:border-white/10"
                  )}
                >
                  <Shield className={cn(
                    "h-6 w-6 mb-2 transition-colors",
                    selectedRole === "partner" ? "text-amber-500" : "text-slate-500 group-hover:text-slate-400"
                  )} />
                  <span className={cn(
                    "font-bold text-sm mb-1",
                    selectedRole === "partner" ? "text-white" : "text-slate-300"
                  )}>{t('roles.partner')}</span>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {t('roomSettings.rolePartnerDesc')}
                  </p>
                </button>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Check className="h-3 w-3 text-emerald-500" />
                {t('roomSettings.inviteExpired')}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Check className="h-3 w-3 text-emerald-500" />
                {t('roomSettings.inviteLimit')}
              </div>
            </div>

            <Button
              onClick={handleGenerateLink}
              disabled={isLoading}
              type="button"
              className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold h-12 shadow-lg shadow-amber-500/20 border-0 transition-all duration-300 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('common.loading')}</span>
                </div>
              ) : t('roomSettings.generateLink')}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-8 animate-in fade-in zoom-in duration-500 ease-out">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                  {t('roomSettings.invite')}
                </label>
                <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded-full">
                  {selectedRole === 'client' ? t('roles.client') : t('roles.partner')}
                </span>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative flex flex-col gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                  <div className="flex-1 min-w-0 px-4 py-3 text-sm text-slate-300 font-mono break-all bg-black/20 rounded-xl border border-white/5 shadow-inner">
                    {inviteUrl}
                  </div>
                  
                  <Button
                    onClick={handleCopyLink}
                    className={cn(
                      "w-full rounded-xl h-12 transition-all duration-300 font-bold uppercase tracking-wider text-xs shadow-lg",
                      copied 
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20" 
                        : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/20"
                    )}
                  >
                    {copied ? (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        <span>{t('settings_status.success')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Copy className="h-4 w-4" />
                        <span>{t('roomSettings.copyLink')}</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                {t('roomSettings.inviteExpired')}
              </p>
            </div>

            <Button
              onClick={() => setOpen(false)}
              variant="ghost"
              className="w-full rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 h-12 font-bold text-xs uppercase tracking-widest transition-all"
            >
              {t('common.cancel')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
