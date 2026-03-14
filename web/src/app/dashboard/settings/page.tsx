import { getSession } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { SettingsForm } from "./settings-form"

export default async function SettingsPage() {
  const session = await getSession()
  
  if (!session?.user) {
    redirect("/")
  }

  return <SettingsForm user={session.user} />
}
