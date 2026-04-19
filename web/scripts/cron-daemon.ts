import cron from 'node-cron';
import { runFileCleanup } from '../src/lib/file-cleanup-service';
import { notifyUsersOfUnreadMessages } from '../src/lib/notification-service';

function parseEnvBoolean(value: string | undefined) {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return v === 'true' || v === '1' || v === 'yes' || v === 'y' || v === 'on';
}

async function runOnce() {
  console.log('--- [CRON-DAEMON] Tick ---');
  const startTime = Date.now();

  console.log('[CRON-DAEMON] Running Unread Messages Notifications Scan...');
  await notifyUsersOfUnreadMessages();
  console.log('[CRON-DAEMON] Unread Messages Notifications Scan Finished.');

  console.log('[CRON-DAEMON] Running File Cleanup...');
  const cleanupStats = await runFileCleanup();
  console.log(`[CRON-DAEMON] Cleanup Finished. Processed: ${cleanupStats.processed}, Deleted: ${cleanupStats.deleted}`);

  const duration = (Date.now() - startTime) / 1000;
  console.log(`--- [CRON-DAEMON] Tick Completed in ${duration}s ---`);
}

const schedule = process.env.CRON_SCHEDULE || '*/5 * * * *';
const timezone = process.env.CRON_TZ || 'UTC';

if (!cron.validate(schedule)) {
  console.error(`[CRON-DAEMON] Invalid CRON_SCHEDULE: ${schedule}`);
  process.exit(1);
}

let running = false;

console.log(`[CRON-DAEMON] Started. schedule="${schedule}" tz="${timezone}"`);

cron.schedule(
  schedule,
  async () => {
    if (running) {
      console.warn('[CRON-DAEMON] Previous tick is still running, skipping.');
      return;
    }
    running = true;
    try {
      await runOnce();
    } catch (error) {
      console.error('[CRON-DAEMON] Tick failed:', error);
    } finally {
      running = false;
    }
  },
  { timezone }
);

if (parseEnvBoolean(process.env.CRON_RUN_ON_START)) {
  runOnce().catch((error) => console.error('[CRON-DAEMON] Initial run failed:', error));
}

