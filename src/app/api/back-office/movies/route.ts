import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.overview || !data.year || !data.durationMin || data.rating === undefined || !data.type) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Build the movie data
    const movieData: any = {
      title: data.title,
      overview: data.overview,
      year: parseInt(data.year),
      durationMin: parseInt(data.durationMin),
      rating: parseFloat(data.rating),
      type: data.type,
      posterUrl: data.posterUrl || null,
      backdropUrl: data.backdropUrl || null,
      trailerUrl: data.trailerUrl || null,
      genres: {
        create: (data.genreIds || []).map((genreId: string) => ({
          genreId: genreId
        }))
      }
    }

    // Add streaming URLs for movies
    if (data.type === 'MOVIE') {
      movieData.streamingUrls = {
        create: (data.streamingUrls || []).map((url: any) => ({
          url: url.url,
          quality: url.quality,
          platform: url.platform,
          isActive: url.isActive ?? true
        }))
      }
    }

    // Add seasons and episodes for TV shows
    if (data.type === 'TV_SHOW' && data.seasons) {
      movieData.seasons = {
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

    // Create the movie with related data
    const movie = await prisma.movie.create({
      data: movieData,
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

    return NextResponse.json({
      success: true,
      movie,
      message: `${data.type === 'MOVIE' ? 'Movie' : 'TV Show'} created successfully`
    })
  } catch (error) {
    console.error("Error creating movie/TV show:", error)

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { message: "Invalid genre ID provided" },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topRated = searchParams.get('topRated') === 'true'
    const trending = searchParams.get('trending') === 'true'
    const featured = searchParams.get('featured') === 'true'
    const genreId = searchParams.get('genreId')
    const search = searchParams.get('search')

    // Build where clause based on filters
    const whereClause: any = {}

    // Top rated filter (rating >= 8.0)
    if (topRated) {
      whereClause.rating = {
        gte: 8.0
      }
    }

    // Trending filter (high view count in last 30 days)
    if (trending) {
      whereClause.viewCount = {
        gte: 100 // Movies with at least 100 views are considered trending
      }
    }

    // Featured content filter
    if (featured) {
      whereClause.featuredContent = {
        isNot: null,
        isActive: true
      }
    }

    // Genre filter
    if (genreId) {
      whereClause.genres = {
        some: {
          genreId: genreId
        }
      }
    }

    // Search filter
    if (search) {
      whereClause.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          overview: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    const movies = await prisma.movie.findMany({
      where: whereClause,
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
        streamingUrls: {
          where: {
            isActive: true
          }
        },
        featuredContent: true,
        heroSection: true
      },
      orderBy: [
        ...(featured ? [{ featuredContent: { sequence: 'asc' as const } }] : []),
        ...(trending ? [{ viewCount: 'desc' as const }] : []),
        ...(topRated ? [{ rating: 'desc' as const }] : []),
        { createdAt: 'desc' as const }
      ]
    })

    const transformedMovies = movies.map(movie => ({
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
      viewCount: movie.viewCount,
      genres: movie.genres.map(mg => mg.genre),
      credits: movie.credits,
      streamingUrls: movie.streamingUrls,
      featuredContent: movie.featuredContent,
      heroSection: movie.heroSection
    }))

    return NextResponse.json(transformedMovies)
  } catch (error) {
    console.error("Error fetching movies:", error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}