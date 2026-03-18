import { buildMentionHandle, extractMentionHandles, parseMentions, splitTextWithMentions, stripMentionsForTranslation } from "@/lib/chat-mentions"

describe("chat-mentions", () => {
  it("builds normalized handles from full name", () => {
    expect(buildMentionHandle("John Doe", "user-id")).toBe("john_doe")
    expect(buildMentionHandle("  Ирина Ли  ", "user-id")).toBe("ирина_ли")
  })

  it("extracts only boundary-safe mentions", () => {
    const handles = extractMentionHandles("hello @anna test@invalid and (@pavel)")
    expect(handles).toEqual(["anna", "pavel"])
  })

  it("validates existing mentions and returns invalid handles", () => {
    const parsed = parseMentions("Hi @anna and @missing", [
      { id: "1", full_name: "Anna" },
      { id: "2", full_name: "Pavel" },
    ])

    expect(parsed.mentionedUsers.map((item) => item.id)).toEqual(["1"])
    expect(parsed.invalidHandles).toEqual(["missing"])
  })

  it("splits text to mention segments with user id", () => {
    const segments = splitTextWithMentions("Hello @anna!", [{ id: "1", full_name: "Anna" }])
    expect(segments).toEqual([
      { type: "text", value: "Hello " },
      { type: "mention", value: "@anna", handle: "anna", userId: "1" },
      { type: "text", value: "!" },
    ])
  })

  it("removes mentions from text passed to translation", () => {
    const cleaned = stripMentionsForTranslation("Привет @anna как дела @pavel")
    expect(cleaned).toBe("Привет как дела")
  })
})
