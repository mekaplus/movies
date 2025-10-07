import { PrismaClient } from '@prisma/client'
import moviesData from '../seed/movies.json'
import genresData from '../seed/genres.json'
import peopleData from '../seed/people.json'

const prisma = new PrismaClient()

// Generate streaming URLs for movies
function generateStreamingUrls(movieId: string, title: string) {
  const baseUrls = [
    'https://xflix.stream',
    'https://premium.xflix.xyz',
    'https://cdn.xflix.net'
  ]

  const qualities = ['1080p', '720p', '4K']
  const platforms = ['Xflix Premium', 'Xflix HD', 'Xflix Direct']

  return qualities.map((quality, index) => ({
    url: `${baseUrls[index % baseUrls.length]}/watch/${movieId}/${quality.toLowerCase()}`,
    quality: quality,
    platform: platforms[index % platforms.length],
    isActive: true
  }))
}

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.featuredContent.deleteMany()
  await prisma.userList.deleteMany()
  await prisma.streamingUrl.deleteMany()
  await prisma.credit.deleteMany()
  await prisma.movieGenre.deleteMany()
  await prisma.movie.deleteMany()
  await prisma.genre.deleteMany()
  await prisma.person.deleteMany()
  await prisma.user.deleteMany()

  // Seed genres first and store them in a map
  console.log('📝 Seeding genres...')
  const genreMap = new Map<string, string>()
  for (const genre of genresData) {
    const createdGenre = await prisma.genre.create({
      data: {
        name: genre.name,
      }
    })
    genreMap.set(genre.name, createdGenre.id)
  }

  // Seed people and store them in a map
  console.log('👥 Seeding people...')
  const personMap = new Map<string, string>()
  for (const person of peopleData) {
    const createdPerson = await prisma.person.create({
      data: {
        name: person.name,
        profileUrl: person.profileUrl,
      }
    })
    personMap.set(person.name, createdPerson.id)
  }

  // Seed movies
  console.log('🎬 Seeding movies...')
  const createdMovies = []
  for (const movie of moviesData) {
    const createdMovie = await prisma.movie.create({
      data: {
        title: movie.title,
        overview: movie.overview,
        year: movie.year,
        durationMin: movie.durationMin,
        rating: movie.rating,
        type: movie.type as 'MOVIE' | 'TV_SHOW',
        posterUrl: movie.posterUrl,
        backdropUrl: movie.backdropUrl,
        streamingUrls: {
          create: generateStreamingUrls(movie.title, movie.title)
        }
      }
    })

    createdMovies.push({ movie: createdMovie, data: movie })

    // Create movie-genre relationships
    for (const genreName of movie.genreNames) {
      const genreId = genreMap.get(genreName)
      if (genreId) {
        await prisma.movieGenre.create({
          data: {
            movieId: createdMovie.id,
            genreId: genreId
          }
        })
      }
    }

    // Create credits
    for (const credit of movie.credits) {
      const personId = personMap.get(credit.personName)
      if (personId) {
        await prisma.credit.create({
          data: {
            movieId: createdMovie.id,
            personId: personId,
            role: credit.role as 'ACTOR' | 'DIRECTOR',
            character: credit.character
          }
        })
      }
    }
  }

  // Create some featured content (top 3 highest rated movies)
  console.log('⭐ Creating featured content...')
  const topMovies = createdMovies
    .sort((a, b) => b.data.rating - a.data.rating)
    .slice(0, 3)

  for (let i = 0; i < topMovies.length; i++) {
    await prisma.featuredContent.create({
      data: {
        movieId: topMovies[i].movie.id,
        sequence: i + 1,
        isActive: true
      }
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })