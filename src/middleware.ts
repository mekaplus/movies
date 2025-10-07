import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for a back-office route (except login)
  if (request.nextUrl.pathname.startsWith('/back-office') &&
      !request.nextUrl.pathname.startsWith('/back-office/login') &&
      request.nextUrl.pathname !== '/back-office') {

    // In a real application, you would validate the JWT token here
    // For now, we'll just check if there's an authorization header
    const token = request.headers.get('authorization') || request.cookies.get('admin-token')?.value

    if (!token) {
      // Redirect to login if no token is present
      return NextResponse.redirect(new URL('/back-office', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/back-office/:path*'
  ]
}