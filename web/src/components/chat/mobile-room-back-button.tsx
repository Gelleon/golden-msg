"use client"

import { useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { useTranslation } from "@/lib/language-context"

const NAVIGATION_GUARD_MS = 800

export function MobileRoomBackButton() {
  const router = useRouter()
  const { t } = useTranslation()
  const navigatingRef = useRef(false)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    }
  }, [])

  const navigateBack = useCallback(() => {
    if (navigatingRef.current) return
    navigatingRef.current = true

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    resetTimerRef.current = setTimeout(() => {
      navigatingRef.current = false
    }, NAVIGATION_GUARD_MS)

    router.push("/dashboard")
  }, [router])

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return
      event.preventDefault()
      event.stopPropagation()
      navigateBack()
    },
    [navigateBack]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== "Enter" && event.key !== " ") return
      event.preventDefault()
      navigateBack()
    },
    [navigateBack]
  )

  return (
    <button
      type="button"
      data-testid="mobile-room-back"
      aria-label={t("room.backToRooms")}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      className="md:hidden relative z-30 flex shrink-0 items-center justify-center min-h-[44px] min-w-[44px] rounded-xl text-slate-500 active:bg-slate-100 active:text-slate-900 touch-manipulation select-none [-webkit-tap-highlight-color:transparent]"
    >
      <ChevronLeft className="h-5 w-5 pointer-events-none" aria-hidden />
    </button>
  )
}
