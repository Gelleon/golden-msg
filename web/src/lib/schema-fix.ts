import prisma from "./db";

/**
 * Automatically fixes the database schema if columns are missing.
 * This is a workaround for production environments where migrations haven't run.
 * It attempts to add missing columns to multiple table name variations.
 */
export async function ensureSchemaFixed() {
  try {
    const tables = ["Message", "User", "message", "user", "messages", "users", "profiles"];
    for (const table of tables) {
      const isMessageTable = table.toLowerCase() === "message" || table.toLowerCase() === "messages";
      const isUserTable = table.toLowerCase() === "user" || table.toLowerCase() === "users" || table.toLowerCase() === "profiles";
      
      if (isMessageTable) {
        // Try both quoted and unquoted for maximum compatibility
        await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "language_original" TEXT DEFAULT 'ru';`).catch(() => {});
        await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "language_original" TEXT DEFAULT 'ru';`).catch(() => {});
        
        await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "content_translated" TEXT;`).catch(() => {});
        await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "content_translated" TEXT;`).catch(() => {});
        
        await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "content" TEXT;`).catch(() => {});
        await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "content" TEXT;`).catch(() => {});
      }
      
      if (isUserTable) {
        await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN "preferred_language" TEXT DEFAULT 'ru';`).catch(() => {});
        await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "preferred_language" TEXT DEFAULT 'ru';`).catch(() => {});
      }
    }
    // console.log("[DB FIX] Schema check/fix completed");
  } catch (e) {
    // Silent catch - we don't want to crash the app if this fails
    console.warn("[DB FIX] Warning: Schema fix attempt failed:", e);
  }
}
