"use client"

import { useEffect } from "react"
import { subscribeToPush } from "@/app/actions/push"

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function PWAService() {
  useEffect(() => {
    async function registerPWA() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        return
      }

      try {
        const registration = await navigator.serviceWorker.register("/sw.js")
        console.log("Service Worker registered with scope:", registration.scope)

        // Request notification permission
        const permission = await Notification.requestPermission()
        if (permission !== "granted") {
          return
        }

        // Get current subscription
        try {
          const subscription = await registration.pushManager.getSubscription()
          
          if (!subscription) {
            // Subscribe if not subscribed
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
            if (vapidPublicKey) {
              try {
                const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)
                const newSubscription = await registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: convertedVapidKey,
                })
                await subscribeToPush(JSON.parse(JSON.stringify(newSubscription)))
              } catch (pushError) {
                // This is where "AbortError: Registration failed - push service not available" is likely caught
                console.warn("Push subscription failed:", pushError)
              }
            }
          } else {
            // Keep server updated with current subscription
            await subscribeToPush(JSON.parse(JSON.stringify(subscription)))
          }
        } catch (subError) {
          console.error("Error getting push subscription:", subError)
        }
      } catch (error) {
        console.error("Service Worker registration failed:", error)
      }
    }

    registerPWA()
  }, [])

  return null
}
