import { render, screen, fireEvent } from "@testing-library/react"
import { MobileRoomBackButton } from "./mobile-room-back-button"

const mockPush = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock("@/lib/language-context", () => ({
  useTranslation: () => ({
    t: (key: string) => (key === "room.backToRooms" ? "К списку комнат" : key),
  }),
}))

describe("MobileRoomBackButton", () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it("navigates to dashboard on pointer up", () => {
    render(<MobileRoomBackButton />)
    const button = screen.getByRole("button", { name: "К списку комнат" })
    fireEvent.pointerUp(button)
    expect(mockPush).toHaveBeenCalledWith("/dashboard")
  })

  it("ignores duplicate pointer ups while navigation is in progress", () => {
    render(<MobileRoomBackButton />)
    const button = screen.getByRole("button", { name: "К списку комнат" })
    fireEvent.pointerUp(button)
    fireEvent.pointerUp(button)
    fireEvent.pointerUp(button)
    expect(mockPush).toHaveBeenCalledTimes(1)
  })
})
