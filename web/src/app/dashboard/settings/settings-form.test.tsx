import { render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { SettingsForm } from "./settings-form"

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn() }),
  usePathname: () => "/dashboard/settings",
  useSearchParams: () => ({
    get: jest.fn(() => null),
    toString: () => "",
  }),
}))

jest.mock("@/lib/language-context", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: "ru",
    setLanguage: jest.fn(),
  }),
}))

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}))

jest.mock("@/app/actions/users", () => ({
  getUsers: jest.fn().mockResolvedValue([]),
  updateUserRole: jest.fn(),
  updateUserName: jest.fn(),
  updateProfile: jest.fn(),
}))

jest.mock("./notification-management-form", () => ({
  NotificationManagementForm: () => <div data-testid="notifications-admin" />,
}))

jest.mock("./notification-settings-form", () => ({
  NotificationSettingsForm: () => <div data-testid="notifications-settings" />,
}))

jest.mock("@/app/actions/upload", () => ({
  uploadFile: jest.fn(),
}))

describe("SettingsForm - users management visibility", () => {
  it("does not show users tab for client role", async () => {
    render(
      <SettingsForm
        user={{
          id: "u-client",
          email: "client@example.com",
          role: "client",
          full_name: "Client",
          avatar_url: null,
          preferred_language: "ru",
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByText("tabs.profile")).toBeInTheDocument()
    })

    expect(screen.queryByText("tabs.users")).not.toBeInTheDocument()
  })

  it("shows users tab for manager role", async () => {
    render(
      <SettingsForm
        user={{
          id: "u-manager",
          email: "manager@example.com",
          role: "manager",
          full_name: "Manager",
          avatar_url: null,
          preferred_language: "ru",
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByText("tabs.users")).toBeInTheDocument()
    })
  })
})

