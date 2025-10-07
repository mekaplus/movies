import { Movie, Genre, MediaType } from "@/lib/types"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function transformPrismaMovie(movie: any): Movie {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    year: movie.year,
    durationMin: movie.durationMin,
    rating: movie.rating,
    type: movie.type,
    posterUrl: movie.posterUrl,
    backdropUrl: movie.backdropUrl,
    viewCount: movie.viewCount,
    genres: movie.genres.map((mg: any) => mg.genre),
    credits: movie.credits,
    streamingUrls: movie.streamingUrls || [],
    featuredContent: movie.featuredContent,
    heroSection: movie.heroSection
  }
}

export async function getMovies(): Promise<Movie[]> {
  const movies = await prisma.movie.findMany({
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
      }
    }
  })

  return movies.map(transformPrismaMovie)
}

export async function getAllMovies(): Promise<Movie[]> {
  return getMovies()
}

export async function getMovieById(id: string): Promise<Movie | null> {
  const movie = await prisma.movie.findUnique({
    where: { id },
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
      }
    }
  })

  return movie ? transformPrismaMovie(movie) : null
}

const includeMovieData = {
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
}

export async function getMoviesByGenre(genreId: string): Promise<Movie[]> {
  const movies = await prisma.movie.findMany({
    where: {
      genres: {
        some: {
          genreId: genreId
        }
      }
    },
    include: includeMovieData
  })

  return movies.map(transformPrismaMovie)
}

export async function getMoviesByGenres(genreIds: string[]): Promise<Movie[]> {
  if (genreIds.length === 0) {
    return getAllMovies()
  }

  const movies = await prisma.movie.findMany({
    where: {
      genres: {
        some: {
          genreId: {
            in: genreIds
          }
        }
      }
    },
    include: includeMovieData
  })

  return movies.map(transformPrismaMovie)
}

export async function getMoviesByType(type: MediaType): Promise<Movie[]> {
  const movies = await prisma.movie.findMany({
    where: {
      type: type
    },
    include: includeMovieData
  })

  return movies.map(transformPrismaMovie)
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const searchTerm = query.toLowerCase()
  const movies = await prisma.movie.findMany({
    where: {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          overview: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        }
      ]
    },
    include: includeMovieData
  })

  return movies.map(transformPrismaMovie)
}

export async function getFeaturedMovie(): Promise<Movie | null> {
  const movies = await prisma.movie.findMany({
    where: {
      rating: {
        gte: 8.5
      }
    },
    include: includeMovieData
  })

  if (movies.length === 0) return null

  const randomIndex = Math.floor(Math.random() * movies.length)
  return transformPrismaMovie(movies[randomIndex])
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const movies = await prisma.movie.findMany({
    where: {
      year: {
        gte: 2018
      }
    },
    orderBy: {
      rating: 'desc'
    },
    take: 20,
    include: includeMovieData
  })

  return movies.map(transformPrismaMovie)
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  const movies = await prisma.movie.findMany({
    orderBy: {
      rating: 'desc'
    },
    take: 10,
    include: includeMovieData
  })

  return movies.map(transformPrismaMovie)
}

export async function getMostViewedMovies(): Promise<Movie[]> {
  const movies = await prisma.movie.findMany({
    orderBy: {
      viewCount: 'desc'
    },
    take: 10,
    include: includeMovieData
  })

  return movies.map(transformPrismaMovie)
}

export async function getSimilarMovies(movieId: string): Promise<Movie[]> {
  const currentMovie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: {
      genres: true
    }
  })

  if (!currentMovie) return []

  const genreIds = currentMovie.genres.map(mg => mg.genreId)

  const movies = await prisma.movie.findMany({
    where: {
      AND: [
        {
          id: {
            not: movieId
          }
        },
        {
          genres: {
            some: {
              genreId: {
                in: genreIds
              }
            }
          }
        }
      ]
    },
    take: 20,
    include: includeMovieData
  })

  return movies.map(transformPrismaMovie)
}

export async function getHeroSectionMovies(): Promise<Movie[]> {
  const movies = await prisma.movie.findMany({
    where: {
      heroSection: {
        isActive: true
      }
    },
    orderBy: {
      heroSection: {
        sequence: 'asc'
      }
    },
    include: includeMovieData
  })

  return movies.map(transformPrismaMovie)
}

export async function getFeaturedContentMovies(): Promise<Movie[]> {
  const movies = await prisma.movie.findMany({
    where: {
      featuredContent: {
        isActive: true
      }
    },
    orderBy: {
      featuredContent: {
        sequence: 'asc'
      }
    },
    include: includeMovieData
  })

  return movies.map(transformPrismaMovie)
}

export async function getRecentlyAddedMovies(): Promise<Movie[]> {
  const movies = await prisma.movie.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 20,
    include: includeMovieData
  })

  return movies.map(transformPrismaMovie)
}

export async function getGenres(): Promise<Genre[]> {
  return await prisma.genre.findMany()
}