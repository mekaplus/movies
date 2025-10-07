"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar/navbar"
import { MovieGrid } from "@/components/grid/movie-grid"
import { Pagination } from "@/components/common/pagination"
import { Movie } from "@/lib/types"
import { getTrendingMovies } from "@/lib/repos/movie-repo"

const ITEMS_PER_PAGE = 20

export default function TrendingPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      try {
        const trendingMovies = await getTrendingMovies()
        setMovies(trendingMovies)
      } catch (error) {
        console.error("Failed to fetch trending movies:", error)
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
            <h1 className="page-title">Trending Now</h1>
            <p className="page-subtitle">
              The most popular movies and shows right now
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