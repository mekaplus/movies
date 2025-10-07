"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar/navbar"
import { MovieGrid } from "@/components/grid/movie-grid"
import { Pagination } from "@/components/common/pagination"
import { Movie } from "@/lib/types"
import { getMoviesByGenre, getGenres } from "@/lib/repos/movie-repo"

const ITEMS_PER_PAGE = 20

export default function GenrePage() {
  const params = useParams()
  const genreId = params.genreId as string

  const [movies, setMovies] = useState<Movie[]>([])
  const [genreName, setGenreName] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [genreMovies, genres] = await Promise.all([
          getMoviesByGenre(genreId),
          getGenres()
        ])

        const genre = genres.find(g => g.id === genreId)
        setGenreName(genre?.name || genreId)
        setMovies(genreMovies)
      } catch (error) {
        console.error("Failed to fetch genre data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [genreId])

  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentMovies = movies.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const capitalizeGenre = (genre: string) => {
    return genre.charAt(0).toUpperCase() + genre.slice(1)
  }

  return (
    <>
      <Navbar />

      <div className="pt-20 pb-16">
        <div className="content-container">
          <div className="page-header">
            <h1 className="page-title">{capitalizeGenre(genreName)} Movies</h1>
            <p className="page-subtitle">
              Explore the best {genreName.toLowerCase()} movies
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