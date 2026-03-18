import { translateText } from "@/lib/dewiar"

describe("dewiar translateText", () => {
  const originalEnvToken = process.env.DEWIAR_API_TOKEN
  const originalFetch = global.fetch

  beforeEach(() => {
    process.env.DEWIAR_API_TOKEN = "test-token"
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  afterAll(() => {
    process.env.DEWIAR_API_TOKEN = originalEnvToken
  })

  it("returns null when provider responds with OpenAI token missing text", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => "DEBUG: No translation (OpenAI Token Missing)",
    }) as unknown as typeof fetch

    const result = await translateText("Привет", "Russian", "Chinese")

    expect(result).toBeNull()
  })
})
