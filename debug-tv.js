const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function getMoviesByType(type) {
  const movies = await prisma.movie.findMany({
    where: {
      type: type
    },
    include: {
      genres: {
        include: {
          genre: true
        }
      }
    }
  })

  return movies.map(movie => ({
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
    genres: movie.genres.map(mg => mg.genre)
  }))
}

async function debugTvShows() {
  try {
    console.log('🔍 Testing getMoviesByType function...')

    const tvShows = await getMoviesByType("TV_SHOW")

    console.log(`✅ Found ${tvShows.length} TV shows:`)
    tvShows.forEach((show, index) => {
      console.log(`${index + 1}. ${show.title} (${show.year}) - Type: ${show.type} - Views: ${show.viewCount.toLocaleString()}`)
    })

  } catch (error) {
    console.error('❌ Error in getMoviesByType:', error)
    console.error('Stack trace:', error.stack)
  }
}

debugTvShows()