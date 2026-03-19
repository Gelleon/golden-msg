import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import { getSession } from "@/app/actions/auth";
import ru from "@/locales/ru.json";
import cn from "@/locales/cn.json";
import { PWAService } from "@/components/pwa-service";
import { SelectionCopyMenu } from "@/components/selection-copy-menu";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  // Removed maximumScale and userScalable for accessibility (WCAG 1.4.4)
};

export async function generateMetadata(): Promise<Metadata> {
  const session = await getSession();
  const lang = (session?.user?.preferred_language as "ru" | "cn") || "ru";
  const translations = lang === "ru" ? ru : cn;

  return {
    title: "Golden Russia",
    description: translations.welcome.heroTitle + " - " + translations.welcome.heroSubtitle,
    manifest: "/manifest.json",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const initialLanguage = (session?.user?.preferred_language as "ru" | "cn") || "ru";

  return (
    <html lang={initialLanguage}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider initialLanguage={initialLanguage}>
          <PWAService />
          <SelectionCopyMenu />
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
