import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: movieId } = await params
    const body = await request.json()
    const { sequence, title, subtitle } = body

    // Check if movie exists
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      include: { heroSection: true }
    })

    if (!movie) {
      return NextResponse.json(
        { message: "Movie not found" },
        { status: 404 }
      )
    }

    // Check if movie is already in hero section
    if (movie.heroSection) {
      return NextResponse.json(
        { message: "Movie is already in hero section" },
        { status: 400 }
      )
    }

    // Create hero section record with simple auto-increment sequence
    const heroSection = await prisma.$transaction(async (tx) => {
      // Get the highest sequence number and add 1
      const lastHero = await tx.heroSection.findFirst({
        orderBy: { sequence: 'desc' }
      })
      const nextSequence = sequence || (lastHero?.sequence || 0) + 1

      // Create the hero section record
      return await tx.heroSection.create({
        data: {
          movieId: movieId,
          sequence: nextSequence,
          title: title || null,
          subtitle: subtitle || null,
          isActive: true
        }
      })
    })

    return NextResponse.json({
      success: true,
      heroSection,
      message: "Movie added to hero section"
    })
  } catch (error) {
    console.error("Error adding movie to hero section:", error)

    // Handle duplicate sequence error
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { message: "Sequence number already exists" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: movieId } = await params

    // Check if movie exists and is in hero section
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      include: { heroSection: true }
    })

    if (!movie) {
      return NextResponse.json(
        { message: "Movie not found" },
        { status: 404 }
      )
    }

    if (!movie.heroSection) {
      return NextResponse.json(
        { message: "Movie is not in hero section" },
        { status: 400 }
      )
    }

    // Delete hero section record
    await prisma.heroSection.delete({
      where: { movieId: movieId }
    })

    return NextResponse.json({
      success: true,
      message: "Movie removed from hero section"
    })
  } catch (error) {
    console.error("Error removing movie from hero section:", error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}