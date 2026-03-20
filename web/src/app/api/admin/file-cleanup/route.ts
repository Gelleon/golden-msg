import { NextResponse } from 'next/server';
import { runFileCleanup, restoreFile } from '@/lib/file-cleanup-service';
import prisma from '@/lib/db';
import { getSession } from '@/app/actions/auth';

/**
 * GET /api/admin/file-cleanup
 * Returns cleanup stats and history
 */
export async function GET() {
  const session = await getSession();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const logs = await (prisma as any).fileDeletionLog.findMany({
      take: 50,
      orderBy: { deleted_at: 'desc' },
      include: { message: true }
    });

    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

/**
 * POST /api/admin/file-cleanup
 * Manually triggers the cleanup process
 */
export async function POST() {
  const session = await getSession();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats = await runFileCleanup();
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/file-cleanup/restore
 * Restores a specific file
 */
export async function PATCH(req: Request) {
  const session = await getSession();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { messageId } = await req.json();
    const result = await restoreFile(messageId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
