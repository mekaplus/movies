import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const isBackOfficeRoute = request.nextUrl.pathname.startsWith('/back-office')
  const isBackOfficeAPI = request.nextUrl.pathname.startsWith('/api/back-office')
  const isLoginRoute = request.nextUrl.pathname === '/back-office' ||
                       request.nextUrl.pathname.startsWith('/api/back-office/auth/')

  // Check if the request is for a protected back-office route or API
  if ((isBackOfficeRoute || isBackOfficeAPI) && !isLoginRoute) {
    const token = request.cookies.get('__xf_sess')?.value

    console.log('Middleware - Path:', request.nextUrl.pathname)
    console.log('Middleware - Token present:', !!token)

    if (!token) {
      console.log('Middleware - No token')

      // For API routes, return 401 Unauthorized
      if (isBackOfficeAPI) {
        return NextResponse.json(
          { message: "Unauthorized" },
          { status: 401 }
        )
      }

      // For page routes, redirect to login
      return NextResponse.redirect(new URL('/back-office', request.url))
    }

    try {
      // Verify JWT token using jose (Edge runtime compatible)
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || '')
      const { payload } = await jwtVerify(token, secret)

      console.log('Middleware - Token valid for:', payload.email)

      // Token is valid, allow the request to proceed
      const response = NextResponse.next()

      // Attach admin info to headers for use in API routes
      response.headers.set('x-admin-id', payload.adminId as string)
      response.headers.set('x-admin-email', payload.email as string)

      return response
    } catch (error) {
      // Invalid or expired token
      console.log('Middleware - Token invalid:', error)

      // For API routes, return 401 Unauthorized
      if (isBackOfficeAPI) {
        return NextResponse.json(
          { message: "Unauthorized - Invalid or expired token" },
          { status: 401 }
        )
      }

      // For page routes, redirect to login and clear cookie
      const response = NextResponse.redirect(new URL('/back-office', request.url))
      response.cookies.delete('__xf_sess')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/back-office/:path*',
    '/api/back-office/:path*'
  ]
}