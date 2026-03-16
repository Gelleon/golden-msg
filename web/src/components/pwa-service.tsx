"use client"

import { useEffect } from "react"
import { subscribeToPush } from "@/app/actions/push"

export function PWAService() {
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope)
          
          // Request notification permission
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              // Get current subscription
              registration.pushManager.getSubscription().then(async (subscription) => {
                if (!subscription) {
                  // Subscribe if not subscribed
                  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                  if (vapidPublicKey) {
                    const newSubscription = await registration.pushManager.subscribe({
                      userVisibleOnly: true,
                      applicationServerKey: vapidPublicKey
                    })
                    await subscribeToPush(JSON.parse(JSON.stringify(newSubscription)))
                  }
                } else {
                  // Keep server updated with current subscription
                  await subscribeToPush(JSON.parse(JSON.stringify(subscription)))
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error)
        })
    }
  }, [])

  return null
}
