"use client"

import { useTranslation } from "@/lib/language-context"

export function ProfileUserMeta({
  role,
  createdAt,
}: {
  role: string
  createdAt: string
}) {
  const { t, language } = useTranslation()
  const locale = language === "cn" ? "zh-CN" : "ru-RU"

  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
        {role}
      </span>
      <span className="text-xs text-slate-400">
        {t("profilePage.memberSince")} {new Date(createdAt).toLocaleDateString(locale)}
      </span>
    </div>
  )
}
