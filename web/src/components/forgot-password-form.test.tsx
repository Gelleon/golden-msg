import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ForgotPasswordForm } from '@/components/forgot-password-form'
import { forgotPassword } from '@/app/actions/auth'

// Mock the server action
jest.mock('@/app/actions/auth', () => ({
  forgotPassword: jest.fn(),
}))

// Mock Math.random to make captcha predictable
const mockMath = Object.create(global.Math)
mockMath.random = () => 0.5 // 0.5 * 10 + 1 = 6
global.Math = mockMath

describe('ForgotPasswordForm', () => {
  const mockOnBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    render(<ForgotPasswordForm onBack={mockOnBack} />)
    expect(screen.getByText('welcome.recovery.title')).toBeInTheDocument()
    expect(screen.getByText('welcome.recovery.email')).toBeInTheDocument()
  })

  it('shows error if captcha is incorrect', async () => {
    render(<ForgotPasswordForm onBack={mockOnBack} />)
    
    fireEvent.change(screen.getByLabelText('welcome.recovery.email'), {
      target: { value: 'test@example.com' },
    })
    
    // Captcha should be 6 + 6 = 12 based on mockMath.random
    fireEvent.change(screen.getByPlaceholderText('?'), {
      target: { value: '13' },
    })
    
    fireEvent.click(screen.getByText('welcome.recovery.submit'))
    
    await waitFor(() => {
      expect(screen.getByText('welcome.recovery.errorCaptcha')).toBeInTheDocument()
      expect(forgotPassword).not.toHaveBeenCalled()
    })
  })

  it('shows error if email is invalid', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordForm onBack={mockOnBack} />)
    
    const emailInput = screen.getByLabelText('welcome.recovery.email')
    await user.type(emailInput, 'invalid-email')
    expect(emailInput).toHaveValue('invalid-email')
    
    await user.click(screen.getByText('welcome.recovery.submit'))
    
    await waitFor(() => {
      expect(screen.getByText('welcome.emailError')).toBeInTheDocument()
      expect(forgotPassword).not.toHaveBeenCalled()
    }, { timeout: 3000 })
  })

  it('calls forgotPassword with correct data when captcha is correct', async () => {
    ;(forgotPassword as jest.Mock).mockResolvedValue({ success: true })
    
    render(<ForgotPasswordForm onBack={mockOnBack} />)
    
    fireEvent.change(screen.getByLabelText('welcome.recovery.email'), {
      target: { value: 'test@example.com' },
    })
    
    // Captcha should be 6 + 6 = 12
    fireEvent.change(screen.getByPlaceholderText('?'), {
      target: { value: '12' },
    })
    
    fireEvent.click(screen.getByText('welcome.recovery.submit'))
    
    await waitFor(() => {
      expect(forgotPassword).toHaveBeenCalledTimes(1)
      const formData = (forgotPassword as jest.Mock).mock.calls[0][0]
      expect(formData.get('email')).toBe('test@example.com')
    })
  })

  it('shows success message on successful submission', async () => {
    ;(forgotPassword as jest.Mock).mockResolvedValue({ success: true })
    
    render(<ForgotPasswordForm onBack={mockOnBack} />)
    
    fireEvent.change(screen.getByLabelText('welcome.recovery.email'), {
      target: { value: 'test@example.com' },
    })
    
    fireEvent.change(screen.getByPlaceholderText('?'), {
      target: { value: '12' },
    })
    
    fireEvent.click(screen.getByText('welcome.recovery.submit'))
    
    await waitFor(() => {
      expect(screen.getByText('welcome.recovery.success')).toBeInTheDocument()
    })
  })

  it('shows error message from server on failure', async () => {
    ;(forgotPassword as jest.Mock).mockResolvedValue({ error: 'errorUserNotFound' })
    
    render(<ForgotPasswordForm onBack={mockOnBack} />)
    
    fireEvent.change(screen.getByLabelText('welcome.recovery.email'), {
      target: { value: 'test@example.com' },
    })
    
    fireEvent.change(screen.getByPlaceholderText('?'), {
      target: { value: '12' },
    })
    
    fireEvent.click(screen.getByText('welcome.recovery.submit'))
    
    await waitFor(() => {
      expect(screen.getByText('errorUserNotFound')).toBeInTheDocument()
    })
  })
})
