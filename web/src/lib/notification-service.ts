import prisma from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { subMinutes } from 'date-fns';
import crypto from 'crypto';
import ruTranslations from '@/locales/ru.json';
import cnTranslations from '@/locales/cn.json';

const INACTIVITY_MINUTES = 60;
const EMAIL_COOLDOWN_HOURS = 24;

const translations: Record<string, any> = {
  ru: ruTranslations,
  cn: cnTranslations,
};

/**
 * Main function to scan for unread messages and notify users via email.
 */
export async function notifyUsersOfUnreadMessages() {
  console.log('Starting unread messages notification scan...');
  
  const now = new Date();
  const inactivityThreshold = subMinutes(now, INACTIVITY_MINUTES);
  const emailCooldownThreshold = new Date(now.getTime() - EMAIL_COOLDOWN_HOURS * 60 * 60 * 1000);

  try {
    const BATCH_SIZE = 50;
    let skip = 0;
    let usersProcessed = 0;

    while (true) {
      // 1. Find users who have email notifications enabled and haven't been notified recently
      const users = await prisma.user.findMany({
        where: {
          email_notifications_enabled: true,
          OR: [
            { last_email_notification_at: null },
            { last_email_notification_at: { lt: emailCooldownThreshold } }
          ]
        },
        include: {
          room_participations: {
            include: {
              room: true
            }
          }
        },
        take: BATCH_SIZE,
        skip: skip
      });

      if (users.length === 0) break;

      console.log(`Checking batch of ${users.length} users (Total processed: ${usersProcessed})...`);

      // Process batch in parallel for better performance
      await Promise.all(users.map(async (user) => {
        const notificationsToSend: { roomName: string; unreadCount: number }[] = [];

        // Fetch unread counts for all user rooms
        const unreadCounts = await Promise.all(user.room_participations.map(async (participant) => {
          // Check if user has been inactive for more than 60 minutes in this room
          if (participant.last_active_at > inactivityThreshold) {
            return null;
          }

          // Count unread messages since last_read_at
          const count = await prisma.message.count({
            where: {
              room_id: participant.room_id,
              sender_id: { not: user.id },
              created_at: { gt: participant.last_read_at }
            }
          });

          if (count > 0) {
            return {
              roomName: participant.room.name || `Room ${participant.room_id.substring(0, 8)}`,
              unreadCount: count
            };
          }
          return null;
        }));

        const filteredNotifications = unreadCounts.filter((n): n is { roomName: string; unreadCount: number } => n !== null);

        if (filteredNotifications.length > 0) {
          await sendNotificationEmail(user, filteredNotifications);
        }
      }));

      usersProcessed += users.length;
      skip += BATCH_SIZE;

      // Safety break to prevent infinite loop
      if (usersProcessed > 10000) {
        console.warn('Scan reached 10,000 users limit, stopping for safety.');
        break;
      }
    }

    console.log(`Unread messages notification scan completed. Processed ${usersProcessed} users.`);
  } catch (error) {
    console.error('Error during notification scan:', error);
  }
}

/**
 * Sends a personalized email to a user.
 */
async function sendNotificationEmail(user: any, rooms: { roomName: string; unreadCount: number }[]) {
  const lang = user.preferred_language || 'ru';
  const t = translations[lang]?.welcome?.email || translations.ru.welcome.email;
  
  const totalUnread = rooms.reduce((sum, r) => sum + r.unreadCount, 0);
  const subject = t.unreadMessagesSubject.replace('{count}', totalUnread.toString());
  
  const roomListHtml = rooms
    .map(r => `<li><strong>${r.roomName}</strong>: ${r.unreadCount} ${t.roomMessage}</li>`)
    .join('');

  const secret = process.env.CRON_SECRET || 'fallback_secret';
  const h = crypto.createHmac('sha256', secret).update(`unsubscribe-${user.id}`).digest('hex');
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/unsubscribe?token=${user.id}&h=${h}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #b45309;">Golden Russia</h2>
      <p>${t.hello.replace('{name}', user.full_name || user.email)}</p>
      <p>${t.inactiveMessage}</p>
      <ul style="list-style-type: none; padding: 0;">
        ${roomListHtml}
      </ul>
      <div style="margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">${t.goToMessages}</a>
      </div>
      <hr style="margin-top: 40px; border: 0; border-top: 1px solid #e2e8f0;">
      <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
        ${t.unsubscribeNote} 
        <a href="${unsubscribeUrl}" style="color: #64748b;">${t.unsubscribeLink}</a>
      </p>
    </div>
  `;

  const result = await sendEmail({
    to: user.email,
    subject,
    html
  });

  // Log the notification
  try {
    await prisma.notificationLog.create({
      data: {
        user_id: user.id,
        email: user.email,
        status: result.success ? 'sent' : 'failed',
        error: result.error,
        metadata: JSON.stringify(rooms)
      }
    });
  } catch (logError) {
    console.error('Failed to create notification log:', logError);
  }

  // Update user's last notification timestamp if successful
  if (result.success) {
    await prisma.user.update({
      where: { id: user.id },
      data: { last_email_notification_at: new Date() }
    });
    console.log(`Notification sent to ${user.email}`);
  }
}
