export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function getLocale(language: string) {
  return language === "cn" ? "zh-CN" : "ru-RU"
}

export function formatChatDayLabel(date: Date, language: string, t: (key: string) => string) {
  const now = new Date()
  const locale = getLocale(language)

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round((today.getTime() - day.getTime()) / (24 * 60 * 60 * 1000))

  if (diffDays === 0) return t("chat.dateToday")
  if (diffDays === 1) return t("chat.dateYesterday")

  const sameYear = now.getFullYear() === date.getFullYear()

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(date)
}

