"use client"

import { useEffect, useMemo, useState } from "react"
import { getRoomDetails } from "@/app/actions/room"
import { useTranslation } from "@/lib/language-context"

function getLocale(language: string) {
  return language === "cn" ? "zh-CN" : "ru-RU"
}

function formatLastSeen(lastActiveAt: string, language: string, t: (key: string) => string) {
  const locale = getLocale(language)
  const now = new Date()
  const dt = new Date(lastActiveAt)

  const sameDay = now.getFullYear() === dt.getFullYear() && now.getMonth() === dt.getMonth() && now.getDate() === dt.getDate()
  const sameYear = now.getFullYear() === dt.getFullYear()

  if (sameDay) {
    const time = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false }).format(dt)
    return `${t("room.lastSeen")} ${time}`
  }

  const date = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", ...(sameYear ? {} : { year: "numeric" }) }).format(dt)
  return `${t("room.lastSeen")} ${date}`
}

export function PrivateRoomOnlineDot({ roomId }: { roomId: string }) {
  const { language } = useTranslation()
  const [lastActiveAt, setLastActiveAt] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const data = await getRoomDetails(roomId)
      if (!data || cancelled) return
      const other = data.participants.find((p: any) => p.id !== data.currentUser?.id)
      setLastActiveAt(other?.last_active_at ?? null)
    }

    load()
    const interval = setInterval(load, 15000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [roomId])

  const isOnline = useMemo(() => {
    if (!lastActiveAt) return false
    return (Date.now() - new Date(lastActiveAt).getTime() <= 2 * 60 * 1000)
  }, [lastActiveAt])

  if (!isOnline) return null

  return (
    <div
      className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-4 md:h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"
      data-language={language}
    />
  )
}

export function PrivateRoomSubtitle({ roomId, sharedRoomNames }: { roomId: string; sharedRoomNames: string[] }) {
  const { t, language } = useTranslation()
  const [lastActiveAt, setLastActiveAt] = useState<string | null>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const data = await getRoomDetails(roomId)
      if (!data || cancelled) return
      const other = data.participants.find((p: any) => p.id !== data.currentUser?.id)
      setLastActiveAt(other?.last_active_at ?? null)
    }

    load()
    const interval = setInterval(load, 15000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [roomId])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(id)
  }, [])

  const isOnline = lastActiveAt ? (now - new Date(lastActiveAt).getTime() <= 2 * 60 * 1000) : false

  const statusText = isOnline
    ? t("room.online")
    : (lastActiveAt ? formatLastSeen(lastActiveAt, language, t) : t("common.unknown"))

  if (sharedRoomNames.length > 0) {
    return `${statusText} · ${t("room.sharedRooms")}: ${sharedRoomNames.join(", ")}`
  }

  return statusText
}

