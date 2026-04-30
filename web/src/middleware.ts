import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Skip middleware for server actions and internal next requests
  if (
    request.headers.get('next-action') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  const host = request.headers.get('host') || request.nextUrl.host
  const isLocalhost =
    host.includes('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.startsWith('0.0.0.0')

  const forwardedProto = request.headers.get('x-forwarded-proto')
  if (!isLocalhost && forwardedProto && forwardedProto !== 'https') {
    const url = new URL(request.url)
    url.protocol = 'https:'
    const rawHost =
      request.headers.get('x-forwarded-host') || request.headers.get('host')
    if (rawHost) {
      url.hostname = rawHost.split(':')[0]
      url.port = ''
    }
    return NextResponse.redirect(url)
  }

  const session = request.cookies.get('session_user_id')

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Redirect authenticated users from home to dashboard
  if (request.nextUrl.pathname === '/') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
