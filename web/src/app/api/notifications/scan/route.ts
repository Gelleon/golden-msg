import { NextRequest, NextResponse } from 'next/server';
import { notifyUsersOfUnreadMessages } from '@/lib/notification-service';
import { getSession } from '@/app/actions/auth';

/**
 * API route to trigger the unread messages notification scan.
 * Should be protected by an API key or internal only.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const isVercelCron = req.headers.get('x-vercel-cron') === '1';

  const session = await getSession()
  const isAdmin = session?.user?.role === 'admin'
  const isCronSecretValid = Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`)

  if (!isVercelCron && !isCronSecretValid && !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await notifyUsersOfUnreadMessages();
    return NextResponse.json({ success: true, message: 'Scan triggered successfully' });
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
