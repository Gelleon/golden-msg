"use server"

import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { getSession } from "./auth"

const MAX_UPLOAD_SIZE_BYTES = 20 * 1024 * 1024

export async function uploadFile(formData: FormData) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  const file = formData.get("file") as File
  if (!file) return { error: "No file provided" }
  if (file.size > MAX_UPLOAD_SIZE_BYTES) return { error: "File is too large. Maximum size is 20 MB" }

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    // Sanitize filename to avoid issues and path traversal
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").replace(/\.\./g, "__")
    const filename = `${uniqueSuffix}-${originalName}`
    
    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "uploads")
    try {
        await mkdir(uploadDir, { recursive: true })
    } catch {
        // Ignore if exists
    }

    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    return { success: true, url: `/uploads/${filename}` }
  } catch (error) {
    console.error("Upload error:", error)
    return { error: "Upload failed" }
  }
}
