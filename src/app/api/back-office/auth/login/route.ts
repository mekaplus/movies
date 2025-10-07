import { NextRequest, NextResponse } from "next/server"

const ADMIN_CREDENTIALS = {
  email: "admin@xflix.xyz",
  password: "admin123" // In production, use hashed passwords
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate credentials (in production, check against database)
    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate simple token (in production, use proper JWT)
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')

    return NextResponse.json({
      token,
      message: "Login successful"
    })
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}