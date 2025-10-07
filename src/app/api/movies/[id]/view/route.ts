import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      },
      select: {
        id: true,
        viewCount: true
      }
    })

    return NextResponse.json({
      success: true,
      viewCount: updatedMovie.viewCount
    })
  } catch (error) {
    console.error('Error incrementing view count:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to increment view count' },
      { status: 500 }
    )
  }
}