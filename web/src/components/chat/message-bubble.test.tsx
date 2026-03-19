import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MessageBubble } from '@/components/chat/message-bubble'
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

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

// Mock next/link
jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ children, href }: any) => <a href={href}>{children}</a>
  }
})

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() })
}))

// Mock server actions
jest.mock('@/app/actions/chat', () => ({
  deleteMessage: jest.fn(),
  updateMessage: jest.fn(),
}))

// Mock Radix primitives if needed or just let them render.
// Sometimes Dialog and ContextMenu portals cause issues in tests.
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => <div data-testid="dialog" data-open={open}>{children}</div>,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('@/components/ui/context-menu', () => ({
  ContextMenu: ({ children }: any) => <div>{children}</div>,
  ContextMenuTrigger: ({ children, asChild }: any) => <div data-testid="context-trigger">{children}</div>,
  ContextMenuContent: ({ children }: any) => <div>{children}</div>,
  ContextMenuItem: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}))

// Mock matchMedia for Radix UI (Context Menu / Dialog)
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

describe('MessageBubble Deletion', () => {
  const mockMessage = {
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

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls onDelete callback when deletion is successful', async () => {
    ;(deleteMessage as jest.Mock).mockResolvedValue({ success: true })
    const handleDelete = jest.fn()

    render(
      <MessageBubble 
        message={mockMessage as any} 
        isCurrentUser={true} 
        onDelete={handleDelete}
      />
    )

    // Open context menu / actions
    // Since it's current user, the delete button is rendered in the hover actions.
    // It's a button with Trash2 icon. Let's find it by role or class.
    const buttons = screen.getAllByRole('button')
    // Find the delete button (usually the last one or has specific class)
    // We can mock the Trash2 icon or just click the button that opens the delete confirm
    // In message-bubble.tsx, there's a button that calls setShowDeleteConfirm(true)
    const deleteButton = buttons.find(b => b.innerHTML.includes('lucide-trash-2')) || buttons[buttons.length - 1]
    
    fireEvent.click(deleteButton)

    // Wait for dialog to open
    await waitFor(() => {
      expect(screen.getByText('chat.deleteConfirmTitle')).toBeInTheDocument()
    })

    // Click confirm
    const confirmButton = screen.getByText('chat.deleteConfirmConfirm')
    fireEvent.click(confirmButton)

    // Check if deleteMessage was called
    await waitFor(() => {
      expect(deleteMessage).toHaveBeenCalledWith('msg-1')
    })

    // Check if onDelete was called
    await waitFor(() => {
      expect(handleDelete).toHaveBeenCalledWith('msg-1')
    })
  })

  it('does not call onDelete when deletion fails', async () => {
    ;(deleteMessage as jest.Mock).mockResolvedValue({ success: false, error: 'Failed' })
    const handleDelete = jest.fn()

    render(
      <MessageBubble 
        message={mockMessage as any} 
        isCurrentUser={true} 
        onDelete={handleDelete}
      />
    )

    const buttons = screen.getAllByRole('button')
    const deleteButton = buttons.find(b => b.innerHTML.includes('lucide-trash-2')) || buttons[buttons.length - 1]
    
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText('chat.deleteConfirmTitle')).toBeInTheDocument()
    })

    const confirmButton = screen.getByText('chat.deleteConfirmConfirm')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(deleteMessage).toHaveBeenCalledWith('msg-1')
    })

    // Check if onDelete was NOT called
    expect(handleDelete).not.toHaveBeenCalled()
  })
})
