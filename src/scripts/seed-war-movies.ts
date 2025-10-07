import { prisma } from '../lib/db'
import warMoviesData from '../seed/war-movies.json'

async function seedWarMovies() {
  console.log('🎬 Seeding war movies...')

  try {
    // First, ensure we have the War genre
    const warGenre = await prisma.genre.upsert({
      where: { name: 'War' },
      update: {},
      create: { name: 'War' }
    })

    // Get or create other genres
    const dramaGenre = await prisma.genre.upsert({
      where: { name: 'Drama' },
      update: {},
      create: { name: 'Drama' }
    })

    const actionGenre = await prisma.genre.upsert({
      where: { name: 'Action' },
      update: {},
      create: { name: 'Action' }
    })

    const historyGenre = await prisma.genre.upsert({
      where: { name: 'History' },
      update: {},
      create: { name: 'History' }
    })

    const thrillerGenre = await prisma.genre.upsert({
      where: { name: 'Thriller' },
      update: {},
      create: { name: 'Thriller' }
    })

    const adventureGenre = await prisma.genre.upsert({
      where: { name: 'Adventure' },
      update: {},
      create: { name: 'Adventure' }
    })

    const comedyGenre = await prisma.genre.upsert({
      where: { name: 'Comedy' },
      update: {},
      create: { name: 'Comedy' }
    })

    const documentaryGenre = await prisma.genre.upsert({
      where: { name: 'Documentary' },
      update: {},
      create: { name: 'Documentary' }
    })

    const genreMap: Record<string, string> = {
      'War': warGenre.id,
      'Drama': dramaGenre.id,
      'Action': actionGenre.id,
      'History': historyGenre.id,
      'Thriller': thrillerGenre.id,
      'Adventure': adventureGenre.id,
      'Comedy': comedyGenre.id,
      'Documentary': documentaryGenre.id,
    }

    let successCount = 0
    let skipCount = 0

    for (const movieData of warMoviesData.movies) {
      try {
        // Check if movie already exists
        const existingMovie = await prisma.movie.findFirst({
          where: {
            title: movieData.title,
            year: movieData.year
          }
        })

        if (existingMovie) {
          console.log(`⏭️  Skipping "${movieData.title}" (${movieData.year}) - already exists`)
          skipCount++
          continue
        }

        // Create the movie with isWarCollection flag
        const movie = await prisma.movie.create({
          data: {
            title: movieData.title,
            overview: movieData.overview,
            year: movieData.year,
            durationMin: movieData.durationMin,
            rating: movieData.rating,
            type: movieData.type as 'MOVIE' | 'TV_SHOW',
            posterUrl: movieData.posterUrl,
            backdropUrl: movieData.backdropUrl,
            trailerUrl: movieData.trailerUrl,
            isWarCollection: true, // Mark as war collection
            genres: {
              create: movieData.genres.map((genreName: string) => ({
                genre: {
                  connect: { id: genreMap[genreName] }
                }
              }))
            }
          }
        })

        console.log(`✅ Added: ${movie.title} (${movie.year})`)
        successCount++
      } catch (error) {
        console.error(`❌ Error adding "${movieData.title}":`, error)
      }
    }

    console.log('\n📊 Seeding Summary:')
    console.log(`   ✅ Successfully added: ${successCount} movies`)
    console.log(`   ⏭️  Skipped (already exists): ${skipCount} movies`)
    console.log(`   📁 Total processed: ${warMoviesData.movies.length} movies`)
    console.log('\n🎉 War movies seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding war movies:', error)
    throw error
  }
}

seedWarMovies()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
