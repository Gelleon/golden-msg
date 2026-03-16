import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ResetPasswordForm } from '@/components/reset-password-form'
import { resetPassword } from '@/app/actions/auth'
import { useRouter, useSearchParams } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

// Mock the server action
jest.mock('@/app/actions/auth', () => ({
  resetPassword: jest.fn(),
}))

describe('ResetPasswordForm', () => {
  const mockPush = jest.fn()
  const mockGet = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useSearchParams as jest.Mock).mockReturnValue({ get: mockGet })
  })

  it('renders correctly', () => {
    mockGet.mockReturnValue('valid-token')
    render(<ResetPasswordForm />)
    expect(screen.getByText('welcome.recovery.resetTitle')).toBeInTheDocument()
  })

  it('shows error if passwords do not match', async () => {
    mockGet.mockReturnValue('valid-token')
    render(<ResetPasswordForm />)
    
    // Select by id instead of label since radix labels can be tricky in tests
    const passwordInput = screen.getByLabelText('welcome.recovery.newPassword')
    const confirmInput = screen.getByLabelText('welcome.recovery.confirmPassword')
    
    fireEvent.change(passwordInput, {
      target: { value: 'Password123!' },
    })
    
    fireEvent.change(confirmInput, {
      target: { value: 'DifferentPassword123!' },
    })
    
    fireEvent.click(screen.getByText('welcome.recovery.resetSubmit'))
    
    // Check if the submit was prevented or error shown
    // We'll wait a bit longer or check the form state
    await waitFor(() => {
      expect(screen.getByText('welcome.recovery.confirmPasswordError')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('calls resetPassword with correct data', async () => {
    mockGet.mockReturnValue('valid-token')
    ;(resetPassword as jest.Mock).mockResolvedValue({ success: true })
    
    render(<ResetPasswordForm />)
    
    fireEvent.change(screen.getByLabelText('welcome.recovery.newPassword'), {
      target: { value: 'Password123!' },
    })
    
    fireEvent.change(screen.getByLabelText('welcome.recovery.confirmPassword'), {
      target: { value: 'Password123!' },
    })
    
    fireEvent.click(screen.getByText('welcome.recovery.resetSubmit'))
    
    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledTimes(1)
      const formData = (resetPassword as jest.Mock).mock.calls[0][0]
      expect(formData.get('token')).toBe('valid-token')
      expect(formData.get('password')).toBe('Password123!')
    })
  })

  it('shows success message and redirects on success', async () => {
    mockGet.mockReturnValue('valid-token')
    ;(resetPassword as jest.Mock).mockResolvedValue({ success: true })
    
    render(<ResetPasswordForm />)
    
    fireEvent.change(screen.getByLabelText('welcome.recovery.newPassword'), {
      target: { value: 'Password123!' },
    })
    
    fireEvent.change(screen.getByLabelText('welcome.recovery.confirmPassword'), {
      target: { value: 'Password123!' },
    })
    
    fireEvent.click(screen.getByText('welcome.recovery.resetSubmit'))
    
    await waitFor(() => {
      expect(screen.getByText('welcome.recovery.resetSuccess')).toBeInTheDocument()
    })
  })

  it('shows server error on failure', async () => {
    mockGet.mockReturnValue('valid-token')
    ;(resetPassword as jest.Mock).mockResolvedValue({ error: 'welcome.recovery.errorTokenInvalid' })
    
    render(<ResetPasswordForm />)
    
    fireEvent.change(screen.getByLabelText('welcome.recovery.newPassword'), {
      target: { value: 'Password123!' },
    })
    
    fireEvent.change(screen.getByLabelText('welcome.recovery.confirmPassword'), {
      target: { value: 'Password123!' },
    })
    
    fireEvent.click(screen.getByText('welcome.recovery.resetSubmit'))
    
    await waitFor(() => {
      expect(screen.getByText('welcome.recovery.errorTokenInvalid')).toBeInTheDocument()
    })
  })
})
