import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const movieId = params.id

    // Delete the movie (cascading deletes will handle related records)
    await prisma.movie.delete({
      where: { id: movieId }
    })

    return NextResponse.json({ message: "Movie deleted successfully" })
  } catch (error) {
    console.error("Error deleting movie:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const movieId = params.id
    const data = await request.json()

    // Delete existing genres and streaming URLs
    await prisma.movieGenre.deleteMany({
      where: { movieId }
    })

    await prisma.streamingUrl.deleteMany({
      where: { movieId }
    })

    // Update the movie with new data
    const movie = await prisma.movie.update({
      where: { id: movieId },
      data: {
        title: data.title,
        overview: data.overview,
        year: data.year,
        durationMin: data.durationMin,
        rating: data.rating,
        type: data.type,
        posterUrl: data.posterUrl || null,
        backdropUrl: data.backdropUrl || null,
        genres: {
          create: data.genreIds.map((genreId: string) => ({
            genreId: genreId
          }))
        },
        streamingUrls: {
          create: data.streamingUrls.map((url: any) => ({
            url: url.url,
            quality: url.quality,
            platform: url.platform,
            isActive: url.isActive
          }))
        }
      },
      include: {
        genres: {
          include: {
            genre: true
          }
        },
        streamingUrls: true
      }
    })

    return NextResponse.json(movie)
  } catch (error) {
    console.error("Error updating movie:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const movieId = params.id

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        genres: {
          include: {
            genre: true
          }
        },
        credits: {
          include: {
            person: true
          }
        },
        streamingUrls: true
      }
    })

    if (!movie) {
      return NextResponse.json(
        { message: "Movie not found" },
        { status: 404 }
      )
    }

    const transformedMovie = {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      year: movie.year,
      durationMin: movie.durationMin,
      rating: movie.rating,
      type: movie.type,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      genres: movie.genres.map(mg => mg.genre),
      credits: movie.credits,
      streamingUrls: movie.streamingUrls
    }

    return NextResponse.json(transformedMovie)
  } catch (error) {
    console.error("Error fetching movie:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}