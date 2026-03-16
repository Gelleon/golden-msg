import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

/**
 * Handle unsubscribe requests from email notifications.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('token');

  if (!userId) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { email_notifications_enabled: false },
    });

    console.log(`User ${user.email} unsubscribed from notifications.`);

    return new NextResponse(
      `<html>
        <body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #0d1117; color: #f0f6fc;">
          <div style="text-align: center; background: #161b22; padding: 40px; border-radius: 12px; border: 1px solid #30363d; box-shadow: 0 8px 24px rgba(0,0,0,0.5);">
            <h1 style="color: #f59e0b;">Golden Russia</h1>
            <h2 style="margin-top: 24px;">Вы успешно отписались от уведомлений</h2>
            <p style="color: #8b949e; margin-top: 16px;">Мы больше не будем присылать вам уведомления о новых сообщениях на почту.</p>
            <div style="margin-top: 32px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings" style="color: #58a6ff; text-decoration: none;">Настройки профиля</a>
            </div>
          </div>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}
