"use client"

import { useTranslation } from "@/lib/language-context"

export type UserRegistrationInfo = {
  email: string
  phone?: string | null
  telegram?: string | null
  whatsapp?: string | null
  wechat?: string | null
  bio_short?: string | null
  join_reason?: string | null
  referred_by?: string | null
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  const { t } = useTranslation()
  return (
    <div className="border-b border-slate-100 py-3 last:border-b-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm text-slate-800 whitespace-pre-wrap break-words">
        {value?.trim() || t("profilePage.notProvided")}
      </dd>
    </div>
  )
}

export function UserRegistrationDetails({ user }: { user: UserRegistrationInfo }) {
  const { t } = useTranslation()

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-2">{t("profilePage.registrationInfo")}</h2>
      <dl>
        <InfoRow label={t("profilePage.email")} value={user.email} />
        <InfoRow label={t("profilePage.phone")} value={user.phone} />
        <InfoRow label={t("profilePage.telegram")} value={user.telegram} />
        <InfoRow label={t("profilePage.whatsapp")} value={user.whatsapp} />
        <InfoRow label={t("profilePage.wechat")} value={user.wechat} />
        <InfoRow label={t("profilePage.bioShort")} value={user.bio_short} />
        <InfoRow label={t("profilePage.joinReason")} value={user.join_reason} />
        <InfoRow label={t("profilePage.referredBy")} value={user.referred_by} />
      </dl>
    </div>
  )
}
