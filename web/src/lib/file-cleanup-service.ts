import prisma from './db';
import fs from 'fs/promises';
import path from 'path';
import { subDays } from 'date-fns';

const CLEANUP_DAYS = parseInt(process.env.FILE_CLEANUP_DAYS || '30');
const RECOVERY_DAYS = parseInt(process.env.FILE_RECOVERY_DAYS || '7');
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups/deleted-files');

interface CleanupStats {
  processed: number;
  deleted: number;
  backedUp: number;
  errors: number;
}

/**
 * Main service to clean up old chat attachments.
 */
export async function runFileCleanup(): Promise<CleanupStats> {
  console.log(`[FileCleanup] Starting cleanup process (Threshold: ${CLEANUP_DAYS} days)...`);
  
  const stats: CleanupStats = {
    processed: 0,
    deleted: 0,
    backedUp: 0,
    errors: 0
  };

  const thresholdDate = subDays(new Date(), CLEANUP_DAYS);

  try {
    // 1. Find messages with files older than threshold
    const oldMessages = await (prisma as any).message.findMany({
      where: {
        file_url: { not: null },
        created_at: { lt: thresholdDate },
        is_pinned: false,
        is_important: false
      },
      select: {
        id: true,
        file_url: true,
        room_id: true,
        message_type: true
      }
    });

    console.log(`[FileCleanup] Found ${oldMessages.length} potential files to clean up.`);

    for (const msg of oldMessages) {
      stats.processed++;
      try {
        if (!msg.file_url) continue;

        const filePath = path.join(UPLOAD_DIR, path.basename(msg.file_url));
        const backupPath = path.join(BACKUP_DIR, path.basename(msg.file_url));

        // 2. Ensure backup directory exists
        await fs.mkdir(BACKUP_DIR, { recursive: true });

        // 3. Move to backup (Soft delete)
        try {
          await fs.access(filePath);
          await fs.rename(filePath, backupPath);
          stats.backedUp++;
          
          // 4. Log the deletion in database
          await (prisma as any).fileDeletionLog.create({
            data: {
              message_id: msg.id,
              room_id: msg.room_id,
              file_url: msg.file_url,
              backup_path: backupPath,
              deleted_at: new Date(),
              expires_at: subDays(new Date(), -RECOVERY_DAYS) // Available for recovery for 7 days
            }
          });

          // 5. Update message to indicate file is archived/removed from main storage
          await (prisma as any).message.update({
            where: { id: msg.id },
            data: { 
              file_url: null,
              content: `[Файл удален после ${CLEANUP_DAYS} дней]` 
            }
          });

          stats.deleted++;
        } catch (fileErr) {
          console.warn(`[FileCleanup] File not found or inaccessible: ${filePath}`);
          stats.errors++;
        }
      } catch (err) {
        console.error(`[FileCleanup] Error processing message ${msg.id}:`, err);
        stats.errors++;
      }
    }

    // 6. Permanently delete backups older than recovery period
    await permanentDeleteExpiredBackups();

    console.log(`[FileCleanup] Finished. Stats:`, stats);
    return stats;
  } catch (error) {
    console.error('[FileCleanup] Critical error during cleanup:', error);
    throw error;
  }
}

/**
 * Permanently deletes files from backup directory after recovery period.
 */
async function permanentDeleteExpiredBackups() {
  const expiredThreshold = new Date();
  
  const expiredLogs = await (prisma as any).fileDeletionLog.findMany({
    where: {
      expires_at: { lt: expiredThreshold }
    }
  });

  for (const log of expiredLogs) {
    try {
      if (log.backup_path) {
        await fs.unlink(log.backup_path).catch(() => {});
      }
      await (prisma as any).fileDeletionLog.delete({
        where: { id: log.id }
      });
    } catch (err) {
      console.error(`[FileCleanup] Error during permanent deletion for log ${log.id}:`, err);
    }
  }
}

/**
 * Restores a file from backup if within recovery period.
 */
export async function restoreFile(messageId: string) {
  const log = await (prisma as any).fileDeletionLog.findFirst({
    where: { message_id: messageId }
  });

  if (!log || !log.backup_path) throw new Error("Резервная копия не найдена или срок хранения истек");

  const originalPath = path.join(UPLOAD_DIR, path.basename(log.file_url));
  
  await fs.rename(log.backup_path, originalPath);
  
  await (prisma as any).message.update({
    where: { id: messageId },
    data: { file_url: log.file_url }
  });

  await (prisma as any).fileDeletionLog.delete({
    where: { id: log.id }
  });

  return { success: true };
}
