"use client"

import { useState } from "react"
import { updateProfile } from "@/app/actions/users"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell, Loader2, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "@/lib/language-context"
import { motion } from "framer-motion"

export function NotificationSettingsForm({ user }: { user: any }) {
  const { toast } = useToast()
  const { t } = useTranslation()
  const [isSaving, setIsSaving] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(user.push_notifications_enabled ?? true)

  const handleSave = async () => {
    setIsSaving(true)
    const formData = new FormData()
    formData.append("pushNotifications", String(pushNotifications))

    try {
      const result = await updateProfile(formData)
      if (result.success) {
        toast({
          title: t('common.changesSaved'),
          description: t('settings.profile.updatedDesc'),
        })
      } else {
        toast({
          title: t('common.error'),
          description: result.error || t('settings.profile.updateError'),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t('common.criticalError'),
        description: t('common.saveChangesCriticalError'),
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="border border-slate-200/60 shadow-xl bg-white rounded-2xl overflow-hidden ring-1 ring-black/[0.03]">
        <CardHeader className="p-6 md:p-8 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 ring-4 ring-blue-600/5">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-1 min-w-0">
              <CardTitle className="text-xl md:text-2xl font-black text-slate-900 tracking-tight break-words">
                {t('tabs.notifications')}
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm font-bold break-words">
                Настройте способы получения уведомлений
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-8 space-y-8">
          <div className="flex flex-row items-center justify-between gap-4 p-4 md:p-6 bg-slate-50/50 rounded-2xl border border-slate-200/40 transition-all hover:bg-white hover:shadow-md group">
            <div className="flex-1 space-y-1 min-w-0">
              <Label className="text-slate-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-2 flex-wrap">
                <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100 shrink-0">
                  <Bell className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <span className="break-words">Push-уведомления</span>
              </Label>
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed pl-1 max-w-md break-words">
                Получайте мгновенные уведомления о новых сообщениях в браузере или на телефоне.
              </p>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={(checked) => setPushNotifications(checked)}
              className="data-[checked=true]:bg-blue-600"
            />
          </div>
        </CardContent>

        <CardFooter className="p-4 md:p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full md:w-auto h-12 px-8 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-900/10 hover:shadow-blue-600/20 group"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            )}
            {t('common.save')}
          </Button>
        </CardFooter>
      </Card>
  )
}
