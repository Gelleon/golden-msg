import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import prisma from "@/lib/db"
import { getSession } from "@/app/actions/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface ProfilePageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params
  const session = await getSession()

  if (!session?.user) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      full_name: true,
      avatar_url: true,
      role: true,
      created_at: true,
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="flex flex-col items-center text-center gap-4">
            <Avatar className="h-20 w-20 md:h-24 md:w-24 ring-4 ring-slate-100">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback className="bg-slate-100 text-slate-700 text-xl font-bold">
                {user.full_name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                {user.full_name || "Unknown user"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">@{user.id.slice(0, 8)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                {user.role}
              </span>
              <span className="text-xs text-slate-400">
                В системе с {new Date(user.created_at).toLocaleDateString("ru-RU")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
