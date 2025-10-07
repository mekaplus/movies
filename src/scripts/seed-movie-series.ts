import { PrismaClient } from '@prisma/client'
import movieSeriesData from '../seed/movie-series.json'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding movie series...')

  for (const movieData of movieSeriesData) {
    try {
      // Check if movie already exists
      const existingMovie = await prisma.movie.findFirst({
        where: { title: movieData.title }
      })

      if (existingMovie) {
        console.log(`🎬 Movie "${movieData.title}" already exists, skipping...`)
        continue
      }

      // Create the movie
      const movie = await prisma.movie.create({
        data: {
          title: movieData.title,
          overview: movieData.description,
          year: movieData.year,
          durationMin: movieData.durationMin,
          rating: movieData.rating,
          type: movieData.type as any,
          posterUrl: movieData.posterUrl,
          backdropUrl: movieData.backdropUrl,
          viewCount: movieData.viewCount
        }
      })

      console.log(`✅ Created movie: ${movie.title}`)
    } catch (error) {
      console.error(`❌ Error creating movie "${movieData.title}":`, error)
    }
  }

  console.log('🎉 Movie series seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })