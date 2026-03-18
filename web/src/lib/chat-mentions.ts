export interface MentionUser {
  id: string
  full_name: string | null
}

export interface MentionCandidate extends MentionUser {
  handle: string
}

export interface MentionParseResult {
  mentionedUsers: MentionCandidate[]
  invalidHandles: string[]
  allMentionCount: number
}

export interface MentionSegment {
  type: "text" | "mention"
  value: string
  handle?: string
  userId?: string
}

const HANDLE_MAX_LENGTH = 32
const HANDLE_MIN_LENGTH = 2
const MENTION_REGEX = /@([\p{L}\p{N}_]{2,32})/gu

export const buildMentionHandle = (fullName: string | null | undefined, userId: string) => {
  const normalized = (fullName || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_]/gu, "")
    .slice(0, HANDLE_MAX_LENGTH)

  if (normalized.length >= HANDLE_MIN_LENGTH) {
    return normalized
  }

  return `user_${userId.replace(/-/g, "").slice(0, 8)}`
}

export const getMentionCandidates = (users: MentionUser[]) =>
  users.reduce<MentionCandidate[]>((acc, user) => {
    const baseHandle = buildMentionHandle(user.full_name, user.id)
    let handle = baseHandle
    let suffix = 1
    const usedHandles = new Set(acc.map((item) => item.handle))

    while (usedHandles.has(handle)) {
      const rawHandle = `${baseHandle}_${suffix}`
      handle = rawHandle.slice(0, HANDLE_MAX_LENGTH)
      suffix += 1
    }

    acc.push({
      ...user,
      handle,
    })

    return acc
  }, [])

const isBoundaryChar = (charBefore: string | undefined) =>
  !charBefore || /\s|\(|\[|\{/.test(charBefore)

const MENTION_WITH_BOUNDARY_REGEX = /(^|[\s([{])@([\p{L}\p{N}_]{2,32})/gu

export const extractMentionHandles = (content: string) => {
  const handles: string[] = []
  let match: RegExpExecArray | null

  while ((match = MENTION_REGEX.exec(content)) !== null) {
    const mentionIndex = match.index
    const charBefore = mentionIndex > 0 ? content[mentionIndex - 1] : undefined
    if (!isBoundaryChar(charBefore)) {
      continue
    }
    handles.push(match[1].toLowerCase())
  }

  return handles
}

export const stripMentionsForTranslation = (content: string) =>
  content
    .replace(MENTION_WITH_BOUNDARY_REGEX, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ *\n */g, "\n")
    .trim()

export const parseMentions = (content: string, users: MentionUser[]): MentionParseResult => {
  const candidates = getMentionCandidates(users)
  const byHandle = new Map(candidates.map((item) => [item.handle.toLowerCase(), item]))
  const rawHandles = extractMentionHandles(content)
  const uniqueHandles = [...new Set(rawHandles)]

  const mentionedUsers: MentionCandidate[] = []
  const invalidHandles: string[] = []

  uniqueHandles.forEach((handle) => {
    const user = byHandle.get(handle)
    if (user) {
      mentionedUsers.push(user)
      return
    }
    invalidHandles.push(handle)
  })

  return {
    mentionedUsers,
    invalidHandles,
    allMentionCount: rawHandles.length,
  }
}

export const splitTextWithMentions = (content: string, users: MentionUser[]): MentionSegment[] => {
  if (!content) return [{ type: "text", value: "" }]

  const candidates = getMentionCandidates(users)
  const byHandle = new Map(candidates.map((item) => [item.handle.toLowerCase(), item]))

  const segments: MentionSegment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = MENTION_REGEX.exec(content)) !== null) {
    const mentionToken = match[0]
    const mentionIndex = match.index
    const charBefore = mentionIndex > 0 ? content[mentionIndex - 1] : undefined

    if (!isBoundaryChar(charBefore)) {
      continue
    }

    if (mentionIndex > lastIndex) {
      segments.push({ type: "text", value: content.slice(lastIndex, mentionIndex) })
    }

    const handle = match[1].toLowerCase()
    const resolved = byHandle.get(handle)
    if (resolved) {
      segments.push({
        type: "mention",
        value: mentionToken,
        handle,
        userId: resolved.id,
      })
    } else {
      segments.push({ type: "text", value: mentionToken })
    }

    lastIndex = mentionIndex + mentionToken.length
  }

  if (lastIndex < content.length) {
    segments.push({ type: "text", value: content.slice(lastIndex) })
  }

  return segments.length ? segments : [{ type: "text", value: content }]
}
