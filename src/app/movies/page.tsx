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

      <div className="pt-20 pb-16">
        <div className="content-container">
          <div className="page-header">
            <h1 className="page-title">Movies</h1>
            <p className="page-subtitle">
              Discover thousands of movies across all genres. Filter by multiple genres to find exactly what you're looking for.
            </p>
          </div>

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
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-400">
                      {filteredMovies.length === movies.length
                        ? `Showing all ${filteredMovies.length} movies`
                        : `Showing ${filteredMovies.length} of ${movies.length} movies`
                      }
                      {selectedGenres.length > 0 && (
                        <span className="ml-2 text-sm text-red-400">
                          • {selectedGenres.length} genre{selectedGenres.length === 1 ? '' : 's'} selected
                        </span>
                      )}
                    </p>
                  </div>

                  {currentMovies.length === 0 ? (
                    <div className="empty-state">
                      <p>No movies found matching your selected genres.</p>
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