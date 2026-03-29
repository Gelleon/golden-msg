import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResetPasswordForm } from '../reset-password-form'
import { resetPassword } from '@/app/actions/auth'
import { useRouter, useSearchParams } from 'next/navigation'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

jest.mock('@/app/actions/auth', () => ({
  resetPassword: jest.fn(),
}))

jest.mock('@/lib/language-context', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'ru',
  }),
}))

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useScroll: jest.fn(() => ({ scrollYProgress: { get: () => 0 } })),
  useTransform: jest.fn(() => ({ get: () => 0 })),
}))

describe('ResetPasswordForm', () => {
  const mockRouter = {
    push: jest.fn(),
  }
  
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('renders invalid token message if token is missing or invalid', () => {
    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: () => null,
    })

    render(<ResetPasswordForm />)
    expect(screen.getByText('welcome.recovery.errorTokenInvalid')).toBeInTheDocument()
  })

  it('renders invalid token message if isValid is false', () => {
    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: () => 'valid-token',
    })

    render(<ResetPasswordForm isValid={false} initialError="welcome.recovery.errorTokenExpired" />)
    expect(screen.getByText('welcome.recovery.errorTokenExpired')).toBeInTheDocument()
  })

  it('renders form if token is valid', () => {
    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: () => 'valid-token',
    })

    render(<ResetPasswordForm isValid={true} />)
    expect(screen.getByLabelText('welcome.recovery.newPassword')).toBeInTheDocument()
    expect(screen.getByLabelText('welcome.recovery.confirmPassword')).toBeInTheDocument()
  })

  it('shows error if passwords do not match', async () => {
    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: () => 'valid-token',
    })

    const user = userEvent.setup()
    render(<ResetPasswordForm isValid={true} />)

    await user.type(screen.getByLabelText('welcome.recovery.newPassword'), 'StrongPass123!')
    await user.type(screen.getByLabelText('welcome.recovery.confirmPassword'), 'DifferentPass123!')
    
    fireEvent.click(screen.getByText('welcome.recovery.resetSubmit'))

    await waitFor(() => {
      expect(screen.getByText('welcome.recovery.confirmPasswordError')).toBeInTheDocument()
    })
  })

  it('submits form successfully', async () => {
    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: () => 'valid-token',
    })
    ;(resetPassword as jest.Mock).mockResolvedValue({ success: true })

    const user = userEvent.setup()
    render(<ResetPasswordForm isValid={true} />)

    await user.type(screen.getByLabelText('welcome.recovery.newPassword'), 'StrongPass123!')
    await user.type(screen.getByLabelText('welcome.recovery.confirmPassword'), 'StrongPass123!')
    
    fireEvent.click(screen.getByText('welcome.recovery.resetSubmit'))

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalled()
      expect(screen.getByText('welcome.recovery.resetSuccess')).toBeInTheDocument()
    })
  })
})
