import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ChatWindow } from '@/components/chat/chat-window'
import { deleteMessage } from '@/app/actions/chat'

// Mock useTranslation
jest.mock('@/lib/language-context', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'ru',
    setLanguage: jest.fn()
  })
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() })
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

// Mock server actions
jest.mock('@/app/actions/chat', () => ({
  getMessages: jest.fn().mockResolvedValue({ messages: [] }),
  markAsRead: jest.fn(),
  deleteMessage: jest.fn(),
}))

// No supabase mock

describe('ChatWindow Deletion Integration', () => {
  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
  }

  const mockProfile = {
    id: 'user-1',
    full_name: 'Test User',
    avatar_url: null,
  }

  const mockMessages = [
    {
      id: 'msg-1',
      content_original: 'Hello world',
      content_translated: null,
      language_original: 'ru',
      message_type: 'text',
      file_url: null,
      voice_transcription: null,
      created_at: new Date().toISOString(),
      sender: {
        id: 'user-1',
        full_name: 'Test User',
        avatar_url: null,
        role: 'user'
      }
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
    window.HTMLElement.prototype.scrollTo = jest.fn()
    
    // Mock EventSource
    class MockEventSource {
      onmessage: any = null
      onerror: any = null
      close = jest.fn()
      constructor(url: string) {}
    }
    ;(global as any).EventSource = MockEventSource
  })

  it('removes message from UI immediately when deletion is successful', async () => {
    ;(deleteMessage as jest.Mock).mockResolvedValue({ success: true })

    render(
      <ChatWindow
        roomId="room-1"
        initialMessages={mockMessages}
        currentUser={mockUser}
        userProfile={mockProfile}
        lastReadAt={new Date().toISOString()}
      />
    )

    // Ensure message is visible
    expect(screen.getByText('Hello world')).toBeInTheDocument()

    // Find delete button and click it
    const buttons = screen.getAllByRole('button')
    const deleteButton = buttons.find(b => b.innerHTML.includes('lucide-trash-2')) || buttons[buttons.length - 1]
    
    fireEvent.click(deleteButton)

    // Wait for confirm dialog
    await waitFor(() => {
      expect(screen.getByText('chat.deleteConfirmTitle')).toBeInTheDocument()
    })

    // Click confirm
    const confirmButton = screen.getByText('chat.deleteConfirmConfirm')
    fireEvent.click(confirmButton)

    // Ensure delete action was called
    await waitFor(() => {
      expect(deleteMessage).toHaveBeenCalledWith('msg-1')
    })

    // Ensure message is removed from UI without refresh
    await waitFor(() => {
      expect(screen.queryByText('Hello world')).not.toBeInTheDocument()
    })
  })
})
