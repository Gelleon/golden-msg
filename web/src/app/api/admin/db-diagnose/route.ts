import { NextRequest, NextResponse } from "next/server"
import path from "path"
import prisma from "@/lib/db"
import { getSession } from "@/app/actions/auth"

function resolveSqlitePath(databaseUrl: string | undefined) {
  if (!databaseUrl) return null
  if (!databaseUrl.startsWith("file:")) return null
  const raw = databaseUrl.slice("file:".length)
  if (!raw) return null
  if (path.isAbsolute(raw)) return raw
  return path.join(process.cwd(), raw)
}

function quoteIdent(name: string) {
  return `"${String(name).replace(/"/g, `""`)}"`
}

export async function GET(req: NextRequest) {
  const session = await getSession()
  const isAdmin = session?.user?.role === "admin"

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const databaseUrl = process.env.DATABASE_URL
  const sqlitePath = resolveSqlitePath(databaseUrl)

  try {
    const tables = await prisma.$queryRawUnsafe<{ name: string }[]>(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`
    )

    const counts: Record<string, number> = {}
    for (const t of tables) {
      try {
        const rows = await prisma.$queryRawUnsafe<{ c: bigint | number }[]>(
          `SELECT COUNT(*) as c FROM ${quoteIdent(t.name)}`
        )
        const c = rows?.[0]?.c ?? 0
        counts[t.name] = typeof c === "bigint" ? Number(c) : Number(c)
      } catch {
        counts[t.name] = -1
      }
    }

    return NextResponse.json({
      ok: true,
      nodeEnv: process.env.NODE_ENV ?? null,
      cwd: process.cwd(),
      databaseUrlKind: databaseUrl ? (databaseUrl.startsWith("file:") ? "sqlite-file" : "other") : null,
      sqlitePath,
      tables: tables.map((t) => t.name),
      counts,
    })
  } catch (e) {
    console.error("DB diagnose error:", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
