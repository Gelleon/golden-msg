import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Polyfill Request/Response for Next.js 13+ App Router testing
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init) {
      this.url = input;
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers);
    }
  };
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body;
      this.status = init?.status || 200;
      this.headers = new Headers(init?.headers);
    }
  };
}

if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init) {
      this.map = new Map();
      if (init) {
        if (init instanceof Headers) {
           init.forEach((value, key) => this.map.set(key, value));
        } else if (Array.isArray(init)) {
           init.forEach(([key, value]) => this.map.set(key, value));
        } else {
           for (const key in init) {
             this.map.set(key, init[key]);
           }
        }
      }
    }
    get(key) { return this.map.get(key); }
    set(key, value) { this.map.set(key, value); }
    forEach(callback) { this.map.forEach(callback); }
  };
}

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
