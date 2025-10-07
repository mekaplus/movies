import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { comparePassword, signToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email }
    })

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, admin.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = await signToken({
      adminId: admin.id,
      email: admin.email
    })

    // Create response with cookie
    const response = NextResponse.json({
      token,
      message: "Login successful",
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    })

    // Set cookie in response
    response.cookies.set({
      name: '__xf_sess',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}