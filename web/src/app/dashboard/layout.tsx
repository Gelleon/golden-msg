import { redirect } from "next/navigation"
import { getSession } from "@/app/actions/auth"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { PageTransition } from "@/components/dashboard/page-transition"
import { LanguageProvider } from "@/lib/language-context"

import { MobileNavProvider } from "@/lib/mobile-nav-context"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session?.user) {
    redirect("/")
  }

  // Use the user from session as the profile since they are merged in Prisma schema
  const user = session.user
  const profile = user
  const initialLanguage = (user.preferred_language as "ru" | "cn") || "ru"

  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <MobileNavProvider>
        <div className="flex h-screen bg-[#0F172A] flex-col md:flex-row overflow-hidden">
          <div className="hidden md:flex h-full">
            <Sidebar user={user} profile={profile} />
          </div>
          <MobileNav user={user} profile={profile} />
          <main className="flex-1 overflow-hidden relative">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </div>
      </MobileNavProvider>
    </LanguageProvider>
  )
}
