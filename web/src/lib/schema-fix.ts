import prisma from "./db";
import { ensureLegacyDataMigrated } from "./legacy-data-migrate"

/**
 * Automatically fixes the database schema if columns are missing.
 * This is a workaround for production environments where migrations haven't run.
 * It attempts to add missing columns to multiple table name variations.
 */
let schemaFixPromise: Promise<void> | null = null

export async function ensureSchemaFixed() {
  if (schemaFixPromise) return schemaFixPromise

  schemaFixPromise = (async () => {
    try {
      const tables = ["Message", "User", "RoomParticipant", "Room", "message", "user", "roomparticipant", "room", "messages", "users", "profiles", "rooms"];
      for (const table of tables) {
        const isMessageTable = table.toLowerCase() === "message" || table.toLowerCase() === "messages";
        const isUserTable = table.toLowerCase() === "user" || table.toLowerCase() === "users" || table.toLowerCase() === "profiles";
        const isRoomParticipantTable = table.toLowerCase() === "roomparticipant";
        const isRoomTable = table.toLowerCase() === "room" || table.toLowerCase() === "rooms";
        
        if (isMessageTable) {
          await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "language_original" TEXT DEFAULT 'ru';`).catch(() => {});
          await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "language_original" TEXT DEFAULT 'ru';`).catch(() => {});
          
          await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "content_translated" TEXT;`).catch(() => {});
          await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "content_translated" TEXT;`).catch(() => {});
          
          await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "content" TEXT;`).catch(() => {});
          await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "content" TEXT;`).catch(() => {});
  
          await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "voice_transcription" TEXT;`).catch(() => {});
          await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "voice_transcription" TEXT;`).catch(() => {});
  
          await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "translation_status" TEXT DEFAULT 'completed';`).catch(() => {});
          await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "translation_status" TEXT DEFAULT 'completed';`).catch(() => {});
  
          await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "translation_error" TEXT;`).catch(() => {});
          await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "translation_error" TEXT;`).catch(() => {});
  
          await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "reply_to_id" TEXT;`).catch(() => {});
          await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "reply_to_id" TEXT;`).catch(() => {});
  
          await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "is_pinned" BOOLEAN DEFAULT 0;`).catch(() => {});
          await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "is_pinned" BOOLEAN DEFAULT 0;`).catch(() => {});
  
          await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "is_important" BOOLEAN DEFAULT 0;`).catch(() => {});
          await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "is_important" BOOLEAN DEFAULT 0;`).catch(() => {});
        }
        
        if (isUserTable) {
          await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "preferred_language" TEXT DEFAULT 'ru';`).catch(() => {});
          await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "preferred_language" TEXT DEFAULT 'ru';`).catch(() => {});
  
          const withNow = `ALTER TABLE ${table} ADD COLUMN "last_active_at" DATETIME DEFAULT CURRENT_TIMESTAMP;`
          const withNowQuoted = `ALTER TABLE "${table}" ADD COLUMN "last_active_at" DATETIME DEFAULT CURRENT_TIMESTAMP;`
          const withConst = `ALTER TABLE ${table} ADD COLUMN "last_active_at" DATETIME DEFAULT '1970-01-01 00:00:00';`
          const withConstQuoted = `ALTER TABLE "${table}" ADD COLUMN "last_active_at" DATETIME DEFAULT '1970-01-01 00:00:00';`

          const ok = await prisma.$executeRawUnsafe(withNow).then(() => true).catch(() => false)
          if (!ok) {
            const okQuoted = await prisma.$executeRawUnsafe(withNowQuoted).then(() => true).catch(() => false)
            if (!okQuoted) {
              const okConst = await prisma.$executeRawUnsafe(withConst).then(() => true).catch(() => false)
              if (!okConst) {
                await prisma.$executeRawUnsafe(withConstQuoted).catch(() => {})
              }
            }
          }
        }
  
        if (isRoomParticipantTable) {
          const lastReadNow = `ALTER TABLE ${table} ADD COLUMN "last_read_at" DATETIME DEFAULT CURRENT_TIMESTAMP;`
          const lastReadNowQuoted = `ALTER TABLE "${table}" ADD COLUMN "last_read_at" DATETIME DEFAULT CURRENT_TIMESTAMP;`
          const lastReadConst = `ALTER TABLE ${table} ADD COLUMN "last_read_at" DATETIME DEFAULT '1970-01-01 00:00:00';`
          const lastReadConstQuoted = `ALTER TABLE "${table}" ADD COLUMN "last_read_at" DATETIME DEFAULT '1970-01-01 00:00:00';`
          const okRead = await prisma.$executeRawUnsafe(lastReadNow).then(() => true).catch(() => false)
          if (!okRead) {
            const okReadQuoted = await prisma.$executeRawUnsafe(lastReadNowQuoted).then(() => true).catch(() => false)
            if (!okReadQuoted) {
              const okReadConst = await prisma.$executeRawUnsafe(lastReadConst).then(() => true).catch(() => false)
              if (!okReadConst) {
                await prisma.$executeRawUnsafe(lastReadConstQuoted).catch(() => {})
              }
            }
          }
  
          const lastActiveNow = `ALTER TABLE ${table} ADD COLUMN "last_active_at" DATETIME DEFAULT CURRENT_TIMESTAMP;`
          const lastActiveNowQuoted = `ALTER TABLE "${table}" ADD COLUMN "last_active_at" DATETIME DEFAULT CURRENT_TIMESTAMP;`
          const lastActiveConst = `ALTER TABLE ${table} ADD COLUMN "last_active_at" DATETIME DEFAULT '1970-01-01 00:00:00';`
          const lastActiveConstQuoted = `ALTER TABLE "${table}" ADD COLUMN "last_active_at" DATETIME DEFAULT '1970-01-01 00:00:00';`
          const okActive = await prisma.$executeRawUnsafe(lastActiveNow).then(() => true).catch(() => false)
          if (!okActive) {
            const okActiveQuoted = await prisma.$executeRawUnsafe(lastActiveNowQuoted).then(() => true).catch(() => false)
            if (!okActiveQuoted) {
              const okActiveConst = await prisma.$executeRawUnsafe(lastActiveConst).then(() => true).catch(() => false)
              if (!okActiveConst) {
                await prisma.$executeRawUnsafe(lastActiveConstQuoted).catch(() => {})
              }
            }
          }
          
          await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "typing_at" DATETIME;`).catch(() => {});
          await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "typing_at" DATETIME;`).catch(() => {});
        }
  
        if (isRoomTable) {
          await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "room_id" TEXT;`).catch(() => {});
          await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "room_id" TEXT;`).catch(() => {});
        }
      }
      await ensureLegacyDataMigrated()
    } catch (e) {
      console.warn("[DB FIX] Warning: Schema fix attempt failed:", e);
      schemaFixPromise = null
    }
  })()

  return schemaFixPromise
}
