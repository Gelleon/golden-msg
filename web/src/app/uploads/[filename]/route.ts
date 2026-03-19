import { NextRequest, NextResponse } from "next/server"
import { join } from "path"
import { existsSync, statSync } from "fs"
import { readFile } from "fs/promises"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> | { filename: string } }
) {
  // Await params if it's a promise (Next.js 14/15 compatibility)
  const resolvedParams = await params;
  const filename = resolvedParams.filename;
  
  const filepath = join(process.cwd(), "public", "uploads", filename)

  if (!existsSync(filepath)) {
    return new NextResponse("Not Found", { status: 404 })
  }

  try {
    const file = await readFile(filepath)
    const stats = statSync(filepath)
    
    // Determine content type based on extension
    const ext = filename.split('.').pop()?.toLowerCase() || ''
    const contentTypes: Record<string, string> = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'webm': 'audio/webm',
      'ogg': 'audio/ogg',
      'mp4': 'video/mp4',
      'pdf': 'application/pdf',
      'txt': 'text/plain',
      'csv': 'text/csv',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
    
    const contentType = contentTypes[ext] || 'application/octet-stream'

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": stats.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    return new NextResponse("Error reading file", { status: 500 })
  }
}
