
import { PrismaClient } from '../src/generated/prisma-client';

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database fix...')
  const tables = ["Message", "User", "messages", "users", "profiles"];
  
  for (const table of tables) {
    console.log(`Checking table: ${table}...`);
    try {
      if (table === "Message" || table === "messages") {
        console.log(`  Adding columns to ${table}...`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "language_original" TEXT DEFAULT 'ru';`).catch(e => console.log(`    (Already exists or error in ${table}: ${e.message})`));
        await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "content_translated" TEXT;`).catch(e => console.log(`    (Already exists or error in ${table}: ${e.message})`));
        await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "content" TEXT;`).catch(e => console.log(`    (Already exists or error in ${table}: ${e.message})`));
      }
      if (table === "User" || table === "users" || table === "profiles") {
        console.log(`  Adding columns to ${table}...`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "preferred_language" TEXT DEFAULT 'ru';`).catch(e => console.log(`    (Already exists or error in ${table}: ${e.message})`));
      }
    } catch (error) {
      console.error(`  Error processing table ${table}:`, error);
    }
  }
  
  console.log('Database fix attempt completed.');
  await prisma.$disconnect()
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
})
