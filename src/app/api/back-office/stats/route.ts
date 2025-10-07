import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
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