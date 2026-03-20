import { searchUsers } from "@/app/actions/room"

export default async function TestPage() {
  const users = await searchUsers("")
  return <pre>{JSON.stringify(users, null, 2)}</pre>
}