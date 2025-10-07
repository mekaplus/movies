import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: movieId } = await params

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: movieId } = await params
    const data = await request.json()

    // Delete existing genres and streaming URLs
    await prisma.movieGenre.deleteMany({
      where: { movieId }
    })

    await prisma.streamingUrl.deleteMany({
      where: { movieId }
    })

    // For TV shows, handle seasons and episodes
    if (data.type === 'TV_SHOW') {
      // Delete existing seasons (cascades to episodes and their streaming URLs)
      await prisma.season.deleteMany({
        where: { movieId }
      })
    }

    // Build the update data
    const updateData: any = {
      title: data.title,
      overview: data.overview,
      year: data.year,
      durationMin: data.durationMin,
      rating: data.rating,
      type: data.type,
      posterUrl: data.posterUrl || null,
      backdropUrl: data.backdropUrl || null,
      trailerUrl: data.trailerUrl || null,
      genres: {
        create: data.genreIds.map((genreId: string) => ({
          genreId: genreId
        }))
      }
    }

    // Add streaming URLs for movies
    if (data.type === 'MOVIE') {
      updateData.streamingUrls = {
        create: (data.streamingUrls || []).map((url: any) => ({
          url: url.url,
          quality: url.quality,
          platform: url.platform,
          isActive: url.isActive
        }))
      }
    }

    // Add seasons and episodes for TV shows
    if (data.type === 'TV_SHOW' && data.seasons) {
      updateData.seasons = {
        create: data.seasons.map((season: any) => ({
          seasonNumber: season.seasonNumber,
          title: season.title,
          overview: season.overview,
          posterUrl: season.posterUrl || null,
          episodeCount: season.episodes?.length || 0,
          episodes: {
            create: (season.episodes || []).map((episode: any) => ({
              episodeNumber: episode.episodeNumber,
              title: episode.title,
              overview: episode.overview,
              durationMin: episode.durationMin,
              rating: episode.rating || 0,
              stillUrl: episode.stillUrl || null,
              streamingUrls: {
                create: (episode.streamingUrls || []).map((url: any) => ({
                  url: url.url,
                  quality: url.quality,
                  platform: url.platform,
                  isActive: url.isActive ?? true
                }))
              }
            }))
          }
        }))
      }
    }

    // Update the movie with new data
    const movie = await prisma.movie.update({
      where: { id: movieId },
      data: updateData,
      include: {
        genres: {
          include: {
            genre: true
          }
        },
        streamingUrls: true,
        seasons: {
          include: {
            episodes: {
              include: {
                streamingUrls: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(movie)
  } catch (error) {
    console.error("❌ Error updating movie:", error)
    console.error("Error details:", error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.stack) {
      console.error("Stack trace:", error.stack)
    }
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: movieId } = await params

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
        streamingUrls: true,
        seasons: {
          include: {
            episodes: {
              include: {
                streamingUrls: true
              },
              orderBy: {
                episodeNumber: 'asc'
              }
            }
          },
          orderBy: {
            seasonNumber: 'asc'
          }
        }
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
      trailerUrl: movie.trailerUrl,
      genres: movie.genres.map(mg => mg.genre),
      credits: movie.credits,
      streamingUrls: movie.streamingUrls,
      seasons: movie.seasons
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