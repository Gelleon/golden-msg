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
  translateMessageAction: jest.fn(),
  pinMessage: jest.fn(),
  unpinMessage: jest.fn(),
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
      role: 'client'
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

describe('MessageBubble Manual Translation UI', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('does not show Translate button by default', () => {
    const msg = {
      id: 'msg-2',
      content_original: 'Привет',
      content_translated: null,
      language_original: 'ru',
      message_type: 'text',
      file_url: null,
      voice_transcription: null,
      created_at: new Date().toISOString(),
      translation_status: 'none',
      sender: {
        id: 'user-1',
        full_name: 'Test User',
        avatar_url: null,
        role: 'client',
      },
    }

    render(<MessageBubble message={msg as any} isCurrentUser={false} />)

    expect(screen.queryByLabelText('chat.translate')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('chat.retryTranslate')).not.toBeInTheDocument()
    expect(screen.queryByText('chat.translating')).not.toBeInTheDocument()
  })

  it('shows translating indicator when translation_status is pending', () => {
    const msg = {
      id: 'msg-3',
      content_original: 'Привет',
      content_translated: null,
      language_original: 'ru',
      message_type: 'text',
      file_url: null,
      voice_transcription: null,
      created_at: new Date().toISOString(),
      translation_status: 'pending',
      sender: {
        id: 'user-1',
        full_name: 'Test User',
        avatar_url: null,
        role: 'client',
      },
    }

    render(<MessageBubble message={msg as any} isCurrentUser={false} />)

    expect(screen.getByText('chat.translating')).toBeInTheDocument()
  })

  it('toggles original/translated view when translation exists', async () => {
    const msg = {
      id: 'msg-4',
      content_original: 'Привет',
      content_translated: '你好',
      language_original: 'ru',
      message_type: 'text',
      file_url: null,
      voice_transcription: null,
      created_at: new Date().toISOString(),
      translation_status: 'completed',
      sender: {
        id: 'user-1',
        full_name: 'Test User',
        avatar_url: null,
        role: 'user',
      },
    }

    render(<MessageBubble message={msg as any} isCurrentUser={false} />)

    expect(screen.getByText('你好')).toBeInTheDocument()
    fireEvent.click(screen.getByText('chat.showOriginal'))
    await waitFor(() => {
      expect(screen.queryByText('你好')).not.toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('chat.showTranslation'))
    await waitFor(() => {
      expect(screen.getByText('你好')).toBeInTheDocument()
    })
  })
})

describe('MessageBubble sender name and role coloring', () => {
  const baseMsg = {
    id: 'msg-role',
    content_original: 'Role test',
    content_translated: null,
    language_original: 'ru',
    message_type: 'text',
    file_url: null,
    voice_transcription: null,
    created_at: new Date().toISOString(),
    translation_status: 'none',
    sender: {
      id: 'user-x',
      full_name: 'Anna Sorokina',
      avatar_url: null,
      role: 'client',
    },
  }

  it('renders sender name above the bubble when showSenderName=true for non-current user', () => {
    render(<MessageBubble message={baseMsg as any} isCurrentUser={false} showSenderName={true} />)
    expect(screen.getByTestId('message-sender-name')).toHaveTextContent('Anna Sorokina')
  })

  it.each([
    ['admin', 'text-red-600'],
    ['manager', 'text-blue-600'],
    ['partner', 'text-amber-700'],
    ['client', 'text-emerald-600'],
  ])('applies role color to sender name role=%s', (role, textClass) => {
    const msg = { ...baseMsg, sender: { ...baseMsg.sender, role } }
    render(<MessageBubble message={msg as any} isCurrentUser={false} showSenderName={true} />)
    const name = screen.getByTestId('message-sender-name')
    expect(name.className).toContain(textClass as string)
  })

  it.each([
    ['admin'],
    ['manager'],
    ['partner'],
    ['client'],
  ])('keeps original bubble color for outgoing message role=%s', (role) => {
    const msg = { ...baseMsg, sender: { ...baseMsg.sender, role } }
    render(<MessageBubble message={msg as any} isCurrentUser={true} />)
    const bubble = screen.getByTestId('message-bubble')
    expect(bubble.className).toContain('from-blue-600')
    expect(bubble.className).toContain('to-blue-700')
    expect(bubble.className).toContain('text-white')
  })

  it.each([
    ['admin'],
    ['manager'],
    ['partner'],
    ['client'],
  ])('keeps original bubble color for incoming message role=%s', (role) => {
    const msg = { ...baseMsg, sender: { ...baseMsg.sender, role } }
    render(<MessageBubble message={msg as any} isCurrentUser={false} />)
    const bubble = screen.getByTestId('message-bubble')
    expect(bubble.className).toContain('bg-white')
    expect(bubble.className).toContain('border-slate-100')
  })
})
