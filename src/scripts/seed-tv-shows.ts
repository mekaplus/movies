import { PrismaClient } from '@prisma/client'
import tvShowsData from '../seed/tv-shows.json'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding TV shows...')

  for (const showData of tvShowsData) {
    try {
      // Check if TV show already exists
      const existingShow = await prisma.movie.findFirst({
        where: { title: showData.title }
      })

      if (existingShow) {
        console.log(`📺 TV show "${showData.title}" already exists, skipping...`)
        continue
      }

      // Create the TV show without genres for now
      const tvShow = await prisma.movie.create({
        data: {
          title: showData.title,
          overview: showData.description,
          year: showData.year,
          durationMin: showData.durationMin,
          rating: showData.rating,
          type: showData.type as any,
          posterUrl: showData.posterUrl,
          backdropUrl: showData.backdropUrl,
          viewCount: showData.viewCount
        }
      })

      console.log(`✅ Created TV show: ${tvShow.title}`)
    } catch (error) {
      console.error(`❌ Error creating TV show "${showData.title}":`, error)
    }
  }

  console.log('🎉 TV shows seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })