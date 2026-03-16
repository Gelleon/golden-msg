import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/app/actions/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin
  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // Fetch last 50 logs
    const logs = await prisma.notificationLog.findMany({
      orderBy: { sent_at: 'desc' },
      take: 50,
      include: {
        user: {
          select: {
            full_name: true,
            email: true,
            avatar_url: true,
          },
        },
      },
    });

    // Calculate stats
    const total = await prisma.notificationLog.count();
    const sent = await prisma.notificationLog.count({
      where: { status: 'sent' },
    });
    const failed = await prisma.notificationLog.count({
      where: { status: 'failed' },
    });

    // Get last scan time (last log date)
    const lastLog = await prisma.notificationLog.findFirst({
      orderBy: { sent_at: 'desc' },
      select: { sent_at: true },
    });

    return NextResponse.json({
      success: true,
      logs: logs.map(log => ({
        ...log,
        sent_at: log.sent_at.toISOString(),
      })),
      stats: {
        total,
        sent,
        failed,
        lastScan: lastLog?.sent_at.toISOString() || null,
      },
    });
  } catch (error) {
    console.error('Failed to fetch notification logs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
