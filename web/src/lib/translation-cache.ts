import { createHash } from "crypto"

type FromLang = "ru" | "cn"

type CacheEntry = {
  value: string
  expiresAt: number
}

const DEFAULT_MAX_ENTRIES = 2000
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24

const cache = new Map<string, CacheEntry>()

function getMaxEntries() {
  const raw = process.env.TRANSLATION_CACHE_MAX_ENTRIES
  const parsed = raw ? Number(raw) : NaN
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_ENTRIES
}

function getTtlMs() {
  const raw = process.env.TRANSLATION_CACHE_TTL_MS
  const parsed = raw ? Number(raw) : NaN
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TTL_MS
}

function makeKey(fromLang: FromLang, text: string) {
  const hash = createHash("sha256").update(text).digest("base64url")
  return `${fromLang}:${hash}`
}

function purgeExpired(now: number) {
  for (const [key, entry] of cache) {
    if (entry.expiresAt <= now) cache.delete(key)
  }
}

function enforceMaxSize() {
  const maxEntries = getMaxEntries()
  while (cache.size > maxEntries) {
    const firstKey = cache.keys().next().value as string | undefined
    if (!firstKey) break
    cache.delete(firstKey)
  }
}

export function getCachedTranslation(text: string, fromLang: FromLang) {
  if (process.env.NODE_ENV === "test") return null
  const now = Date.now()
  purgeExpired(now)

  const key = makeKey(fromLang, text)
  const entry = cache.get(key)
  if (!entry) return null
  if (entry.expiresAt <= now) {
    cache.delete(key)
    return null
  }

  cache.delete(key)
  cache.set(key, entry)
  return entry.value
}

export function setCachedTranslation(text: string, fromLang: FromLang, value: string) {
  if (process.env.NODE_ENV === "test") return
  const now = Date.now()
  purgeExpired(now)

  const key = makeKey(fromLang, text)
  cache.set(key, { value, expiresAt: now + getTtlMs() })
  enforceMaxSize()
}
