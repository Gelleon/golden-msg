import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import { getSession } from "@/app/actions/auth";
import ru from "@/locales/ru.json";
import cn from "@/locales/cn.json";
import { PWAService } from "@/components/pwa-service";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const session = await getSession();
  const lang = (session?.user?.preferred_language as "ru" | "cn") || "ru";
  const translations = lang === "ru" ? ru : cn;

  return {
    title: "Golden Russia",
    description: translations.welcome.heroTitle + " - " + translations.welcome.heroSubtitle,
    manifest: "/manifest.json",
    themeColor: "#020617",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
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
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
