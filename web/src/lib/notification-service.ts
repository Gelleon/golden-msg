import prisma from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { subMinutes } from 'date-fns';
import crypto from 'crypto';
import ruTranslations from '@/locales/ru.json';
import cnTranslations from '@/locales/cn.json';

const INACTIVITY_MINUTES = 5;
const EMAIL_COOLDOWN_MINUTES = 10;

interface TranslationSet {
  welcome: {
    emailNotifications: {
      unreadMessagesSubject: string;
      hello: string;
      inactiveMessage: string;
      roomMessage: string;
      goToMessages: string;
      unsubscribeNote: string;
      unsubscribeLink: string;
    };
  };
}

const translations: Record<string, TranslationSet> = {
  ru: ruTranslations as unknown as TranslationSet,
  cn: cnTranslations as unknown as TranslationSet,
};

interface NotificationQueueItem {
  userId: string;
  roomId: string;
  messageId: string;
  scheduledAt: Date;
}

const notificationQueue: NotificationQueueItem[] = [];
let isQueueProcessing = false;

// В оперативной памяти храним блокировки для предотвращения race conditions
const processingUsers = new Set<string>();

/**
 * Adds a notification to the queue if a user is offline.

 * @param userId ID of the user to notify
 * @param roomId ID of the room where the message was sent
 * @param messageId ID of the message that triggered the notification
 */
export async function queueNotificationIfOffline(userId: string, roomId: string, messageId: string) {
  try {
    // 1. Check if user is online (this could be from a Redis store or recent activity)
    // For now, we'll check last_active_at in the database
    const participation = await prisma.roomParticipant.findUnique({
      where: {
        room_id_user_id: {
          user_id: userId,
          room_id: roomId
        }
      },
      select: {
        last_active_at: true,
        user: {
          select: {
            email_notifications_enabled: true,
            last_email_notification_at: true
          }
        }
      }
    });

    if (!participation || !participation.user.email_notifications_enabled) return;

    const now = new Date();

    // Check email cooldown (don't spam)
    const emailCooldownThreshold = new Date(now.getTime() - EMAIL_COOLDOWN_MINUTES * 60 * 1000);
    if (participation.user.last_email_notification_at && participation.user.last_email_notification_at > emailCooldownThreshold) {
      return;
    }

    // 2. Check if already in queue for this user/room
    const alreadyQueued = notificationQueue.find(item => item.userId === userId && item.roomId === roomId);
    if (alreadyQueued) return;

    // 3. Add to queue
    const scheduledAt = new Date(now.getTime() + INACTIVITY_MINUTES * 60 * 1000);
    notificationQueue.push({
      userId,
      roomId,
      messageId,
      scheduledAt
    });

    console.log(`Queued notification for user ${userId} in room ${roomId} at ${scheduledAt.toISOString()}`);

    // Start processing if not already
    if (!isQueueProcessing) {
      processQueue();
    }
  } catch (error) {
    console.error('Error queuing notification:', error);
  }
}

/**
 * Removes all pending notifications for a user from the queue.
 * Should be called when user becomes online or reads messages.
 * @param userId ID of the user
 */
export function clearUserFromNotificationQueue(userId: string) {
  let count = 0;
  for (let i = notificationQueue.length - 1; i >= 0; i--) {
    if (notificationQueue[i].userId === userId) {
      notificationQueue.splice(i, 1);
      count++;
    }
  }
  if (count > 0) {
    console.log(`Cleared ${count} notifications from queue for user ${userId}`);
  }
}

/**
 * Periodically processes the notification queue.
 */
async function processQueue() {
  isQueueProcessing = true;

  try {
    while (notificationQueue.length > 0) {
      const now = new Date();
      const nextBatch = notificationQueue.filter(item => item.scheduledAt <= now);

      if (nextBatch.length === 0) {
        // Wait for 1 minute before checking again if queue is not empty but no items are ready
        await new Promise(resolve => setTimeout(resolve, 60 * 1000));
        continue;
      }

      // Remove from main queue
      nextBatch.forEach(item => {
        const index = notificationQueue.indexOf(item);
        if (index > -1) notificationQueue.splice(index, 1);
      });

      // Process batch
      await Promise.all(nextBatch.map(async (item) => {
        // Prevent concurrent processing for the same user
        if (processingUsers.has(item.userId)) return;
        processingUsers.add(item.userId);

        try {
          // Re-verify if user is still offline and hasn't read the messages
          const participation = await prisma.roomParticipant.findUnique({
            where: {
              room_id_user_id: {
                user_id: item.userId,
                room_id: item.roomId
              }
            },
            include: {
              user: true,
              room: true
            }
          });

          if (!participation) return;

          // If user became active or read messages, skip
          if (participation.last_active_at > subMinutes(now, INACTIVITY_MINUTES)) return;

          // Find all unread messages
          const unreadMessages = await prisma.message.findMany({
            where: {
              room_id: item.roomId,
              sender_id: { not: item.userId },
              created_at: { gt: participation.last_read_at }
            },
            select: { created_at: true },
            orderBy: { created_at: 'desc' }
          });

          if (unreadMessages.length > 0) {
            const latestMessageDate = unreadMessages[0].created_at;

            // Блокировка повторной отправки: проверяем, отправляли ли мы уже уведомление после появления этого сообщения
            if (
              participation.user.last_email_notification_at &&
              latestMessageDate <= participation.user.last_email_notification_at
            ) {
              console.log(`[NotificationQueue] Skipping duplicate notification for user ${item.userId} in room ${item.roomId}`);
              return;
            }

            const result = await sendNotificationEmail(participation.user, [{
              roomName: participation.room.name || `Room ${item.roomId.substring(0, 8)}`,
              unreadCount: unreadMessages.length
            }]);
            
            if (result.success) {
              console.log(`[NotificationQueue] Successfully notified user ${item.userId} for room ${item.roomId}`);
            } else {
              console.error(`[NotificationQueue] Failed to notify user ${item.userId} for room ${item.roomId}: ${result.error}`);
            }
          }
        } catch (err) {
          console.error(`Failed to process queued notification for user ${item.userId}:`, err);
        } finally {
          processingUsers.delete(item.userId);
        }
      }));
    }
  } catch (error) {
    console.error('Error in queue processing:', error);
  } finally {
    isQueueProcessing = false;
  }
}

/**
 * Main function to scan for unread messages and notify users via email.
 */
export async function notifyUsersOfUnreadMessages() {
  console.log('Starting unread messages notification scan...');
  
  const now = new Date();
  const inactivityThreshold = subMinutes(now, INACTIVITY_MINUTES);
  const emailCooldownThreshold = new Date(now.getTime() - EMAIL_COOLDOWN_MINUTES * 60 * 1000);

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
        if (processingUsers.has(user.id)) return;
        processingUsers.add(user.id);

        try {
          let hasNewUnreadMessages = false;
          const roomsToNotify: { roomName: string; unreadCount: number }[] = [];

          // Fetch unread counts for all user rooms
          await Promise.all(user.room_participations.map(async (participant) => {
            // Check if user has been inactive for more than 5 minutes in this room
            if (participant.last_active_at > inactivityThreshold) {
              return;
            }

            // Find all unread messages
            const unreadMessages = await prisma.message.findMany({
              where: {
                room_id: participant.room_id,
                sender_id: { not: user.id },
                created_at: { gt: participant.last_read_at }
              },
              select: { created_at: true },
              orderBy: { created_at: 'desc' }
            });

            if (unreadMessages.length > 0) {
              const latestMessageDate = unreadMessages[0].created_at;

              // Проверяем, есть ли новые сообщения с момента последнего уведомления
              if (!user.last_email_notification_at || latestMessageDate > user.last_email_notification_at) {
                hasNewUnreadMessages = true;
              }

              roomsToNotify.push({
                roomName: participant.room.name || `Room ${participant.room_id.substring(0, 8)}`,
                unreadCount: unreadMessages.length
              });
            }
          }));

          // Отправляем письмо ТОЛЬКО если есть новые сообщения, о которых мы еще не уведомляли
          if (hasNewUnreadMessages && roomsToNotify.length > 0) {
            await sendNotificationEmail(user, roomsToNotify);
          }
        } finally {
          processingUsers.delete(user.id);
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

interface User {
  id: string;
  email: string;
  full_name?: string | null;
  preferred_language?: string | null;
}

/**
 * Sends a personalized email to a user.
 */
async function sendNotificationEmail(user: User, rooms: { roomName: string; unreadCount: number }[]) {
  // Validate email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!user.email || !emailRegex.test(user.email)) {
    console.error(`Invalid email address for user ${user.id}: ${user.email}`);
    return { success: false, error: 'Invalid email address' };
  }

  const lang = user.preferred_language || 'ru';
  const t = translations[lang]?.welcome?.emailNotifications || translations.ru.welcome.emailNotifications;
  
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

  let result: { success: boolean; error?: string; messageId?: string } = { success: false, error: 'Not attempted' };
  let attempts = 0;
  const MAX_ATTEMPTS = 3;

  while (attempts < MAX_ATTEMPTS) {
    attempts++;
    try {
      result = await sendEmail({
        to: user.email,
        subject,
        html
      });
      if (result.success) break;
    } catch (error: any) {
      result = { success: false, error: error.message };
    }
    
    if (!result.success && attempts < MAX_ATTEMPTS) {
      console.warn(`Attempt ${attempts} to send email to ${user.email} failed. Retrying in 2 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  try {
    // Log the notification
    await prisma.notificationLog.create({
      data: {
        user_id: user.id,
        email: user.email,
        status: result.success ? 'sent' : 'failed',
        error: result.error,
        metadata: JSON.stringify(rooms)
      }
    });

    // Update user's last notification timestamp if successful
    if (result.success) {
      await prisma.user.update({
        where: { id: user.id },
        data: { last_email_notification_at: new Date() }
      });
      console.log(`Notification sent to ${user.email} after ${attempts} attempt(s)`);
    } else {
      console.error(`Failed to send notification email to ${user.email} after ${attempts} attempts:`, result.error);
      
      // Alert Admin if max attempts reached and failed
      if (process.env.ADMIN_EMAIL) {
        try {
          await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: 'System Alert: Email Delivery Failed',
            html: `<p>Failed to deliver unread messages notification to <b>${user.email}</b>.</p><p>Error: ${result.error}</p>`
          });
        } catch (adminErr) {
          console.error('Failed to send alert to admin:', adminErr);
        }
      }
    }

    return result;
  } catch (error: any) {
    console.error('Error in sendNotificationEmail finalize block:', error);
    return { success: false, error: error.message };
  }
}
