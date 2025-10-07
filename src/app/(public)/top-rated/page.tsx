"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar/navbar"
import { MovieGrid } from "@/components/grid/movie-grid"
import { Pagination } from "@/components/common/pagination"
import { Movie } from "@/lib/types"
import { getTopRatedMovies } from "@/lib/repos/movie-repo"

const ITEMS_PER_PAGE = 20

export default function TopRatedPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      try {
        const topRatedMovies = await getTopRatedMovies()
        setMovies(topRatedMovies)
      } catch (error) {
        console.error("Failed to fetch top rated movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentMovies = movies.slice(startIndex, endIndex)

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
            <h1 className="page-title">Top Rated</h1>
            <p className="page-subtitle">
              The highest rated movies and shows of all time
            </p>
          </div>

          {loading ? (
            <div className="loading-grid">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="loading-card" />
              ))}
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
        </div>
      </div>
    </>
  )
}