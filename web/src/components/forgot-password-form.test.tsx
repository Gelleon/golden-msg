import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ForgotPasswordForm } from '@/components/forgot-password-form'
import { forgotPassword } from '@/app/actions/auth'

// Mock the server action
jest.mock('@/app/actions/auth', () => ({
  forgotPassword: jest.fn(),
}))

describe('ForgotPasswordForm', () => {
  const mockOnBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    render(<ForgotPasswordForm onBack={mockOnBack} />)
    expect(screen.getByText('recovery.title')).toBeInTheDocument()
    expect(screen.getByLabelText('recovery.email')).toBeInTheDocument()
  })

  it('calls forgotPassword with correct data', async () => {
    ;(forgotPassword as jest.Mock).mockResolvedValue({ success: true })
    
    render(<ForgotPasswordForm onBack={mockOnBack} />)
    
    fireEvent.change(screen.getByLabelText('recovery.email'), {
      target: { value: 'test@example.com' },
    })
    
    fireEvent.click(screen.getByText('recovery.submit'))
    
    await waitFor(() => {
      expect(forgotPassword).toHaveBeenCalledTimes(1)
      const formData = (forgotPassword as jest.Mock).mock.calls[0][0]
      expect(formData.get('email')).toBe('test@example.com')
    })
  })

  it('shows success message on successful submission', async () => {
    ;(forgotPassword as jest.Mock).mockResolvedValue({ success: true })
    
    render(<ForgotPasswordForm onBack={mockOnBack} />)
    
    fireEvent.change(screen.getByLabelText('recovery.email'), {
      target: { value: 'test@example.com' },
    })
    
    fireEvent.click(screen.getByText('recovery.submit'))
    
    await waitFor(() => {
      expect(screen.getByText('recovery.success')).toBeInTheDocument()
    })
  })

  it('shows error message on failure', async () => {
    ;(forgotPassword as jest.Mock).mockResolvedValue({ error: 'errorUnknown' })
    
    render(<ForgotPasswordForm onBack={mockOnBack} />)
    
    fireEvent.change(screen.getByLabelText('recovery.email'), {
      target: { value: 'test@example.com' },
    })
    
    fireEvent.click(screen.getByText('recovery.submit'))
    
    await waitFor(() => {
      expect(screen.getByText('errorUnknown')).toBeInTheDocument()
    })
  })
})
