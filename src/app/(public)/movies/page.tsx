"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar/navbar"
import { MovieGrid } from "@/components/grid/movie-grid"
import { Pagination } from "@/components/common/pagination"
import { GenreFilter } from "@/components/filters/genre-filter"
import { Movie } from "@/lib/types"

const ITEMS_PER_PAGE = 20

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/movies')
        if (!response.ok) {
          throw new Error('Failed to fetch movies')
        }
        const moviesList = await response.json()
        setMovies(moviesList)
        setFilteredMovies(moviesList)
      } catch (error) {
        console.error("Failed to fetch movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  useEffect(() => {
    const filterMovies = async () => {
      if (selectedGenres.length === 0) {
        setFilteredMovies(movies)
      } else {
        try {
          const genresParam = selectedGenres.join(',')
          const response = await fetch(`/api/movies/by-genres?genres=${genresParam}`)
          if (!response.ok) {
            throw new Error('Failed to fetch filtered movies')
          }
          const filtered = await response.json()
          setFilteredMovies(filtered)
        } catch (error) {
          console.error("Failed to filter movies:", error)
          setFilteredMovies(movies)
        }
      }
      setCurrentPage(1)
    }

    if (movies.length > 0) {
      filterMovies()
    }
  }, [selectedGenres, movies])

  const handleGenresChange = (genres: string[]) => {
    setSelectedGenres(genres)
  }

  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentMovies = filteredMovies.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-xflix-dark pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://image.tmdb.org/t/p/original/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg')",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-xflix-dark via-xflix-dark/80 to-transparent" />
              </div>

              <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  Movies
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
                  Discover thousands of movies across all genres. Filter by multiple genres to find exactly what you're looking for.
                </p>
                <div className="mt-6 flex items-center gap-4 text-sm text-gray-400">
                  <span className="px-3 py-1 bg-xflix-red/20 text-xflix-red rounded-full border border-xflix-red/30">
                    {filteredMovies.length} Movies
                  </span>
                  {selectedGenres.length > 0 && (
                    <span>{selectedGenres.length} genre{selectedGenres.length === 1 ? '' : 's'} selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filter and Content Section */}
          <div className="movies-page-layout">
            <aside className="movies-filters">
              <GenreFilter
                selectedGenres={selectedGenres}
                onGenresChange={handleGenresChange}
              />
            </aside>

            <main className="movies-content">
              {loading ? (
                <div className="loading-grid">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="loading-card" />
                  ))}
                </div>
              ) : (
                <>
                  {currentMovies.length === 0 ? (
                    <div className="text-center py-20">
                      <h3 className="text-2xl text-gray-400 mb-4">No movies found</h3>
                      <p className="text-gray-500">
                        {selectedGenres.length > 0
                          ? 'No movies match your selected genres. Try adjusting your filters.'
                          : 'Check back later for more movies.'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <MovieGrid movies={currentMovies} />

                      {totalPages > 1 && (
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}