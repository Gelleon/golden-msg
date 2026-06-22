"use client"

import { useTranslation } from "@/lib/language-context"

export function ProfileUserTitle({ fullName }: { fullName?: string | null }) {
  const { t } = useTranslation()
  return (
    <h1 className="text-xl md:text-2xl font-bold text-slate-900">
      {fullName || t("profilePage.unknownUser")}
    </h1>
  )
}
