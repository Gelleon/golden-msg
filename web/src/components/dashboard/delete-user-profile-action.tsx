"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"
import { deleteUser } from "@/app/actions/users"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "@/lib/language-context"

export function DeleteUserProfileAction({ userId, userLabel }: { userId: string; userLabel: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteUser(userId)
      if (result.success) {
        toast({
          title: t('common.success') || "Успешно",
          description: t('settings.users.deleteUserSuccess') || "Пользователь удалён",
        })
        setOpen(false)
        router.push("/dashboard/settings?tab=users", { scroll: false })
        router.refresh()
      } else {
        toast({
          title: t('common.error') || "Ошибка",
          description: result.error || t('settings.users.deleteUserError') || "Не удалось удалить пользователя",
          variant: "destructive",
        })
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        className="gap-2"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        {t("settings.users.deleteUser")}
      </Button>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (isDeleting) return
          setOpen(v)
        }}
      >
        <DialogContent className="max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-black/10 ring-1 ring-black/5">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900">{t("settings.users.deleteUserConfirmTitle") || "Удалить пользователя?"}</DialogTitle>
            <DialogDescription className="text-sm font-medium text-slate-600">
              {t("settings.users.deleteUserConfirmDesc") || "Это действие необратимо. Пользователь будет удалён из системы."} {userLabel ? `(${userLabel})` : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              className="h-10 rounded-xl font-black text-slate-600 hover:bg-slate-100"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="h-10 rounded-xl font-black"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : t("settings.users.deleteUser")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

