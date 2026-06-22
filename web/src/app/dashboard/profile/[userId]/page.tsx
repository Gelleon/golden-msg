import { notFound, redirect } from "next/navigation"
import prisma from "@/lib/db"
import { getSession } from "@/app/actions/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DeleteUserProfileAction } from "@/components/dashboard/delete-user-profile-action"
import { UserRegistrationDetails } from "@/components/dashboard/user-registration-details"
import { ProfilePageHeader } from "@/components/dashboard/profile-page-header"

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
      email: true,
      full_name: true,
      avatar_url: true,
      role: true,
      created_at: true,
      phone: true,
      telegram: true,
      whatsapp: true,
      wechat: true,
      bio_short: true,
      join_reason: true,
      referred_by: true,
    },
  })

  if (!user) {
    notFound()
  }

  const canDeleteUser = session.user.role === "admin" && session.user.id !== user.id
  const canViewRegistrationInfo =
    session.user.role === "admin" || session.user.role === "manager"

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4">
          <ProfilePageHeader />
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
              <ProfileUserTitle fullName={user.full_name} />
              <p className="text-sm text-slate-500 mt-1">@{user.id.slice(0, 8)}</p>
            </div>
            <ProfileUserMeta role={user.role} createdAt={user.created_at.toISOString()} />
            {canDeleteUser && (
              <div className="pt-2">
                <DeleteUserProfileAction userId={user.id} userLabel={user.full_name || user.email} />
              </div>
            )}
          </div>
        </div>

        {canViewRegistrationInfo && <UserRegistrationDetails user={user} />}
      </div>
    </div>
  )
}
