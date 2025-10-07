import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Check authentication via headers set by middleware
    const adminId = request.headers.get('x-admin-id')
    const adminEmail = request.headers.get('x-admin-email')

    if (!adminId || !adminEmail) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get statistics from database
    const [
      totalMovies,
      totalUsers,
      totalStreamingUrls
    ] = await Promise.all([
      prisma.movie.count(),
      prisma.user.count(),
      prisma.streamingUrl.count()
    ])

    // Mock total views for demo (in production, you'd track this)
    const totalViews = Math.floor(Math.random() * 10000) + 5000

    return NextResponse.json({
      totalMovies,
      totalUsers,
      totalViews,
      totalStreamingUrls
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}