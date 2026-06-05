import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DEFAULT_SESSION_ID = "create-room-shift"

function readDebugEnv() {
  const candidates = [
    path.join(process.cwd(), ".dbg", `${DEFAULT_SESSION_ID}.env`),
    path.join(process.cwd(), "..", ".dbg", `${DEFAULT_SESSION_ID}.env`),
  ]

  for (const p of candidates) {
    try {
      const content = fs.readFileSync(p, "utf8")
      const url = content.match(/^DEBUG_SERVER_URL=(.+)$/m)?.[1]?.trim()
      const sessionId = content.match(/^DEBUG_SESSION_ID=(.+)$/m)?.[1]?.trim()
      if (url) return { url, sessionId: sessionId || DEFAULT_SESSION_ID }
    } catch {}
  }

  return null
}

export async function POST(req: NextRequest) {
  const cfg = readDebugEnv()
  if (!cfg?.url) return new NextResponse(null, { status: 204 })

  let payload: any = null
  try {
    payload = await req.json()
  } catch {
    return new NextResponse(null, { status: 204 })
  }

  try {
    await fetch(cfg.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: cfg.sessionId,
        ts: Date.now(),
        ...payload,
      }),
    })
  } catch {}

  return new NextResponse(null, { status: 204 })
}

