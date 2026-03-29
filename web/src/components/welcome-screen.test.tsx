import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { WelcomeScreen } from '@/components/welcome-screen'
import { login, register } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock server actions
jest.mock('@/app/actions/auth', () => ({
  login: jest.fn(),
  register: jest.fn(),
}))

// Mock ChinaRussiaBackground to avoid issues with framer-motion hooks
jest.mock('@/components/china-russia-background', () => ({
  ChinaRussiaBackground: () => <div data-testid="background" />
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useScroll: () => ({ scrollYProgress: { get: () => 0, onChange: () => {} } }),
  useTransform: () => 0,
  useSpring: () => 0,
}))

describe('WelcomeScreen', () => {
  const mockPush = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('renders language selection initially', () => {
    render(<WelcomeScreen />)
    expect(screen.getByText('welcome.chooseLanguage')).toBeInTheDocument()
    expect(screen.getByText('welcome.russian')).toBeInTheDocument()
    expect(screen.getByText('welcome.chinese')).toBeInTheDocument()
  })

  it('switches to auth screen after choosing language', async () => {
    render(<WelcomeScreen />)
    
    fireEvent.click(screen.getByText('welcome.russian'))
    
    await waitFor(() => {
      expect(screen.queryByText('welcome.chooseLanguage')).not.toBeInTheDocument()
      expect(screen.getByText('welcome.welcomeBack')).toBeInTheDocument()
    })
  })

  it('toggles between login and register', async () => {
    render(<WelcomeScreen />)
    fireEvent.click(screen.getByText('welcome.russian'))
    
    // Default is login
    expect(screen.getByText('welcome.welcomeBack')).toBeInTheDocument()
    
    // Switch to register
    fireEvent.click(screen.getByText('welcome.toggleToRegister'))
    expect(screen.getByText('welcome.createAccount')).toBeInTheDocument()
    expect(screen.getByLabelText('welcome.fullName')).toBeInTheDocument()
    
    // Switch back to login
    fireEvent.click(screen.getByText('welcome.toggleToLogin'))
    expect(screen.getByText('welcome.welcomeBack')).toBeInTheDocument()
  })

  it('shows validation errors for invalid email', async () => {
    const user = userEvent.setup()
    render(<WelcomeScreen />)
    fireEvent.click(screen.getByText('welcome.russian'))
    
    const emailInput = screen.getByLabelText('welcome.email')
    await user.type(emailInput, 'invalid-email')
    
    await waitFor(() => {
      expect(screen.getByText('welcome.emailError')).toBeInTheDocument()
    })
  })

  it('calls login action on successful form submission', async () => {
    const user = userEvent.setup()
    ;(login as jest.Mock).mockResolvedValue({ success: true })
    
    render(<WelcomeScreen />)
    fireEvent.click(screen.getByText('welcome.russian'))
    
    await user.type(screen.getByLabelText('welcome.email'), 'test@example.com')
    await user.type(screen.getByLabelText('welcome.password'), 'password123')
    
    fireEvent.click(screen.getByText('welcome.submitLogin'))
    
    await waitFor(() => {
      expect(login).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('calls register action on successful form submission', async () => {
    const user = userEvent.setup()
    ;(register as jest.Mock).mockResolvedValue({ success: true })
    
    render(<WelcomeScreen />)
    fireEvent.click(screen.getByText('welcome.russian'))
    
    // Switch to register
    fireEvent.click(screen.getByText('welcome.toggleToRegister'))
    
    await user.type(screen.getByLabelText('welcome.fullName'), 'Test User')
    await user.type(screen.getByLabelText('welcome.email'), 'test@example.com')
    await user.type(screen.getByLabelText('welcome.password'), 'password123')
    await user.type(screen.getByLabelText('welcome.recovery.confirmPassword'), 'password123')
    
    fireEvent.click(screen.getByText('welcome.submitRegister'))
    
    await waitFor(() => {
      expect(register).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('shows error message if auth fails', async () => {
    const user = userEvent.setup()
    ;(login as jest.Mock).mockResolvedValue({ error: 'invalidCredentials' })
    
    render(<WelcomeScreen />)
    fireEvent.click(screen.getByText('welcome.russian'))
    
    await user.type(screen.getByLabelText('welcome.email'), 'test@example.com')
    await user.type(screen.getByLabelText('welcome.password'), 'wrong-password')
    
    fireEvent.click(screen.getByText('welcome.submitLogin'))
    
    await waitFor(() => {
      expect(screen.getByText('invalidCredentials')).toBeInTheDocument()
    })
  })

  it('shows error message if registration fails', async () => {
    const user = userEvent.setup()
    ;(register as jest.Mock).mockResolvedValue({ error: 'emailAlreadyInUse' })
    
    render(<WelcomeScreen />)
    fireEvent.click(screen.getByText('welcome.russian'))
    
    // Switch to register
    fireEvent.click(screen.getByText('welcome.toggleToRegister'))
    
    await user.type(screen.getByLabelText('welcome.fullName'), 'Test User')
    await user.type(screen.getByLabelText('welcome.email'), 'existing@example.com')
    await user.type(screen.getByLabelText('welcome.password'), 'password123')
    await user.type(screen.getByLabelText('welcome.recovery.confirmPassword'), 'password123')
    
    fireEvent.click(screen.getByText('welcome.submitRegister'))
    
    await waitFor(() => {
      expect(screen.getByText('emailAlreadyInUse')).toBeInTheDocument()
    })
  })

  it('navigates to forgot password form', async () => {
    render(<WelcomeScreen />)
    fireEvent.click(screen.getByText('welcome.russian'))
    
    fireEvent.click(screen.getByText('welcome.forgotPassword'))
    
    await waitFor(() => {
      expect(screen.getByText('welcome.recovery.title')).toBeInTheDocument()
    })
  })
})
