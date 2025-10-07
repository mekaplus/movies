"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar/navbar"
import { MovieGrid } from "@/components/grid/movie-grid"
import { Pagination } from "@/components/common/pagination"
import { Movie } from "@/lib/types"
import { getMoviesByType } from "@/lib/repos/movie-repo"

const ITEMS_PER_PAGE = 20

export default function TVPage() {
  const [tvShows, setTvShows] = useState<Movie[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTvShows = async () => {
      setLoading(true)
      try {
        const tvShowsList = await getMoviesByType("TV_SHOW")
        setTvShows(tvShowsList)
      } catch (error) {
        console.error("Failed to fetch TV shows:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTvShows()
  }, [])

  const totalPages = Math.ceil(tvShows.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentShows = tvShows.slice(startIndex, endIndex)

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
            <h1 className="page-title">TV Shows</h1>
            <p className="page-subtitle">
              Binge-watch the best TV series and shows
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
        </div>
      </div>
    </>
  )
}