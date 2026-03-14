"use server"

import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { getSession } from "./auth"

export async function uploadFile(formData: FormData) {
  const session = await getSession()
  if (!session?.user) return { error: "Unauthorized" }

  const file = formData.get("file") as File
  if (!file) return { error: "No file provided" }

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    // Sanitize filename to avoid issues
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${uniqueSuffix}-${originalName}`
    
    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "uploads")
    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (e) {
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
