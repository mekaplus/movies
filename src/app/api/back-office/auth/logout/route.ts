import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({
    message: "Logout successful"
  })

  // Clear the authentication cookie
  response.cookies.set({
    name: '__xf_sess',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })

  return response
}
