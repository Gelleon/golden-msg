"use client"

import { useEffect } from "react"
import { pingUserPresence } from "@/app/actions/presence"

export function PresenceHeartbeat() {
  useEffect(() => {
    let cancelled = false

    const ping = async () => {
      if (cancelled) return
      await pingUserPresence()
    }

    const onVisibility = () => {
      if (document.visibilityState === "visible") ping()
    }

    ping()
    const interval = setInterval(ping, 30000)
    window.addEventListener("focus", ping)
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      cancelled = true
      clearInterval(interval)
      window.removeEventListener("focus", ping)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return null
}
