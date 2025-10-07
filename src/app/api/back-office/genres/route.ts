import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(genres)
  } catch (error) {
    console.error("Error fetching genres:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}