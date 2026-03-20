import prisma from "./db";

/**
 * Automatically fixes the database schema if columns are missing.
 * This is a workaround for production environments where migrations haven't run.
 * It attempts to add missing columns to multiple table name variations.
 */
export async function ensureSchemaFixed() {
  try {
    const tables = ["Message", "User", "RoomParticipant", "Room", "message", "user", "roomparticipant", "room", "messages", "users", "profiles", "rooms"];
    for (const table of tables) {
      const isMessageTable = table.toLowerCase() === "message" || table.toLowerCase() === "messages";
      const isUserTable = table.toLowerCase() === "user" || table.toLowerCase() === "users" || table.toLowerCase() === "profiles";
      const isRoomParticipantTable = table.toLowerCase() === "roomparticipant";
      const isRoomTable = table.toLowerCase() === "room" || table.toLowerCase() === "rooms";
      
      if (isMessageTable) {
        // Try both quoted and unquoted for maximum compatibility
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
      }
      
      if (isUserTable) {
        await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "preferred_language" TEXT DEFAULT 'ru';`).catch(() => {});
        await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "preferred_language" TEXT DEFAULT 'ru';`).catch(() => {});
      }

      if (isRoomParticipantTable) {
        await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "last_active_at" DATETIME DEFAULT CURRENT_TIMESTAMP;`).catch(() => {});
        await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "last_active_at" DATETIME DEFAULT CURRENT_TIMESTAMP;`).catch(() => {});
        
        await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "typing_at" DATETIME;`).catch(() => {});
        await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "typing_at" DATETIME;`).catch(() => {});
      }

      if (isRoomTable) {
        await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "room_id" TEXT;`).catch(() => {});
        await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "room_id" TEXT;`).catch(() => {});
      }
    }
    // console.log("[DB FIX] Schema check/fix completed");
  } catch (e) {
    // Silent catch - we don't want to crash the app if this fails
    console.warn("[DB FIX] Warning: Schema fix attempt failed:", e);
  }
}
