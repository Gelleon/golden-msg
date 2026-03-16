import prisma from "@/lib/db";
import webpush from "web-push";

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.warn("VAPID keys not found. Push notifications will not work.");
} else {
  webpush.setVapidDetails(
    "mailto:support@golden-russia.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function sendPushNotification(userId: string, payload: { title: string; body: string; url?: string }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { push_subscriptions: true },
  });

  if (!user || !user.push_notifications_enabled) return;

  const results = await Promise.allSettled(
    user.push_subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify(payload)
        );
      } catch (error: any) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          // Subscription expired or no longer valid
          await prisma.pushSubscription.delete({ where: { id: sub.id } });
        }
        throw error;
      }
    })
  );

  return results;
}
