import { prisma } from "@/lib/db"
import { MovieGrid } from "@/components/grid/movie-grid"

export const metadata = {
  title: "War Collection - Xflix",
  description: "Explore our curated collection of the greatest war movies of all time, including World War I, World War II, Vietnam, and modern warfare films.",
}

export default async function WarCollectionPage() {
  // Fetch all war collection movies
  const movies = await prisma.movie.findMany({
    where: {
      isWarCollection: true
    },
    include: {
      genres: {
        include: {
          genre: true
        }
      }
    },
    orderBy: {
      rating: 'desc'
    }
  })

  const formattedMovies = movies.map(movie => ({
    ...movie,
    genres: movie.genres.map(mg => mg.genre)
  }))

  return (
    <div className="min-h-screen bg-xflix-dark pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://image.tmdb.org/t/p/original/2WgieNR1tGHlpJUsolbVzbUbE1O.jpg')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-xflix-dark via-xflix-dark/80 to-transparent" />
            </div>

            <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                War Collection
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
                Explore the most powerful and acclaimed war films from World War I, World War II, Vietnam, Korea, and modern conflicts.
                These movies capture the courage, sacrifice, and human cost of war.
              </p>
              <div className="mt-6 flex items-center gap-4 text-sm text-gray-400">
                <span className="px-3 py-1 bg-xflix-red/20 text-xflix-red rounded-full border border-xflix-red/30">
                  {movies.length} Movies
                </span>
                <span>Curated Collection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {movies.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white">All War Movies</h2>
              <p className="text-gray-400 mt-2">
                Sorted by rating - From timeless classics to modern masterpieces
              </p>
            </div>
            <MovieGrid movies={formattedMovies} />
          </>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl text-gray-400 mb-4">No war movies found</h3>
            <p className="text-gray-500">Check back later for our curated war collection.</p>
          </div>
        )}
      </div>
    </div>
  )
}
