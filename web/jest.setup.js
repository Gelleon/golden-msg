import '@testing-library/jest-dom'

// Mock context or providers if needed
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

jest.mock('@/lib/language-context', () => ({
  useTranslation: () => ({
    t: (key) => key,
    language: 'ru',
    setLanguage: jest.fn(),
  }),
}))
