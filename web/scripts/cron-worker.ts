import { runFileCleanup } from '../src/lib/file-cleanup-service';

/**
 * Standalone cron worker script.
 * Can be executed via: npx ts-node scripts/cron-worker.ts
 * Or after build: node dist/scripts/cron-worker.js
 */
async function main() {
  console.log('--- [CRON] Starting Scheduled Tasks ---');
  const startTime = Date.now();

  try {
    // 1. Run File Cleanup (Attachments > 30 days)
    console.log('[CRON] Running File Cleanup...');
    const cleanupStats = await runFileCleanup();
    console.log(`[CRON] Cleanup Finished. Processed: ${cleanupStats.processed}, Deleted: ${cleanupStats.deleted}`);

    // 2. Add other periodic tasks here (e.g., database vacuum, stats generation)
    // console.log('[CRON] Running other tasks...');

    const duration = (Date.now() - startTime) / 1000;
    console.log(`--- [CRON] All Tasks Completed Successfully in ${duration}s ---`);
    process.exit(0);
  } catch (error) {
    console.error('--- [CRON] Critical Error during Scheduled Tasks ---');
    console.error(error);
    process.exit(1);
  }
}

// Execute
main();
