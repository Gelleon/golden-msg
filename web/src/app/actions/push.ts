"use server"

import prisma from "@/lib/db";
import { getSession } from "@/app/actions/auth";

export async function subscribeToPush(subscription: any) {
  const session = await getSession();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        user_id: session.user.id,
      },
      create: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        user_id: session.user.id,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Push Subscription Error:", error);
    return { error: "Failed to subscribe" };
  }
}
