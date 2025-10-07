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

      // Create seasons and episodes with streaming URLs
      const totalSeasons = (showData as any).totalSeasons || 1
      const episodesPerSeason = Math.ceil(((showData as any).totalEpisodes || 10) / totalSeasons)

      for (let seasonNum = 1; seasonNum <= totalSeasons; seasonNum++) {
        const season = await prisma.season.create({
          data: {
            movieId: tvShow.id,
            seasonNumber: seasonNum,
            title: `Season ${seasonNum}`,
            overview: `Season ${seasonNum} of ${tvShow.title}`,
            posterUrl: showData.posterUrl,
            episodeCount: episodesPerSeason,
            airDate: new Date(showData.year + seasonNum - 1, 0, 1)
          }
        })

        console.log(`  📁 Created Season ${seasonNum}`)

        // Create episodes for this season
        for (let episodeNum = 1; episodeNum <= episodesPerSeason; episodeNum++) {
          const episode = await prisma.episode.create({
            data: {
              seasonId: season.id,
              episodeNumber: episodeNum,
              title: `Episode ${episodeNum}`,
              overview: `Episode ${episodeNum} of Season ${seasonNum}`,
              durationMin: showData.durationMin,
              rating: showData.rating,
              airDate: new Date(showData.year + seasonNum - 1, 0, episodeNum),
              stillUrl: showData.backdropUrl,
              viewCount: Math.floor(Math.random() * 100000)
            }
          })

          // Create streaming URLs for the episode
          await prisma.episodeStreamingUrl.createMany({
            data: [
              {
                episodeId: episode.id,
                url: `https://vidsrc.xyz/embed/tv/${(showData as any).tmdbId}/${seasonNum}/${episodeNum}`,
                quality: '1080p',
                platform: 'VidSrc',
                isActive: true
              },
              {
                episodeId: episode.id,
                url: `https://vidsrc.to/embed/tv/${(showData as any).tmdbId}/${seasonNum}/${episodeNum}`,
                quality: '1080p',
                platform: 'VidSrc Pro',
                isActive: true
              }
            ]
          })
        }
      }

      console.log(`  ✅ Created ${totalSeasons} seasons with episodes and streaming URLs`)
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