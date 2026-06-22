"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/language-context"

export function ProfilePageHeader() {
  const { t } = useTranslation()

  return (
    <Button asChild variant="ghost" className="gap-2">
      <Link href="/dashboard">
        <ArrowLeft className="h-4 w-4" />
        {t("profilePage.back")}
      </Link>
    </Button>
  )
}
