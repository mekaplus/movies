"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar/navbar"
import { MovieGrid } from "@/components/grid/movie-grid"
import { Pagination } from "@/components/common/pagination"
import { GenreFilter } from "@/components/filters/genre-filter"
import { Movie, Genre } from "@/lib/types"

const ITEMS_PER_PAGE = 20

export default function TVPage() {
  const [tvShows, setTvShows] = useState<Movie[]>([])
  const [filteredShows, setFilteredShows] = useState<Movie[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const tvShowsResponse = await fetch('/api/tv-shows')

        if (!tvShowsResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const tvShowsList = await tvShowsResponse.json()

        setTvShows(Array.isArray(tvShowsList) ? tvShowsList : [])
        setFilteredShows(Array.isArray(tvShowsList) ? tvShowsList : [])
        console.log('✅ Successfully loaded TV shows:', Array.isArray(tvShowsList) ? tvShowsList.length : 0)
      } catch (error) {
        console.error("❌ Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (selectedGenres.length > 0) {
      const filtered = tvShows.filter(show =>
        show.genres &&
        Array.isArray(show.genres) &&
        show.genres.some(genre => selectedGenres.includes(genre.id))
      )
      setFilteredShows(filtered)
    } else {
      setFilteredShows(tvShows)
    }
    setCurrentPage(1)
  }, [selectedGenres, tvShows])

  const totalPages = Math.ceil(filteredShows.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentShows = filteredShows.slice(startIndex, endIndex)

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
                  backgroundImage: "url('https://image.tmdb.org/t/p/original/9faGSFi5jam6pDWGNd0p8JcJgXQ.jpg')",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-xflix-dark via-xflix-dark/80 to-transparent" />
              </div>

              <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  TV Shows
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
                  Binge-watch the best TV series and shows across all genres. From drama to comedy, find your next favorite series.
                </p>
                <div className="mt-6 flex items-center gap-4 text-sm text-gray-400">
                  <span className="px-3 py-1 bg-xflix-red/20 text-xflix-red rounded-full border border-xflix-red/30">
                    {filteredShows.length} Shows
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
                onGenresChange={setSelectedGenres}
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
                  {filteredShows.length === 0 ? (
                    <div className="text-center py-20">
                      <h3 className="text-2xl text-gray-400 mb-4">No TV shows found</h3>
                      <p className="text-gray-500">
                        {selectedGenres.length > 0
                          ? 'No TV shows match your selected genres. Try adjusting your filters.'
                          : 'Check back later for more TV shows.'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <MovieGrid movies={currentShows} />

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