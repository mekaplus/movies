"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Trash2, Search, LogOut } from "@/components/common/icons"
import { Movie } from "@/lib/types"

export default function BackOfficeMovies() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string>("")
  const [showTopRated, setShowTopRated] = useState(false)
  const [showTrending, setShowTrending] = useState(false)
  const [showFeatured, setShowFeatured] = useState(false)
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("admin-token")
    if (!token) {
      router.push("/back-office")
      return
    }

    fetchMovies()
    fetchGenres()
  }, [router])

  useEffect(() => {
    let filtered = movies

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.overview.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by genre
    if (selectedGenre) {
      filtered = filtered.filter(movie =>
        movie.genres?.some(genre => genre.id === selectedGenre)
      )
    }

    // Filter by top rated (rating >= 8.0)
    if (showTopRated) {
      filtered = filtered.filter(movie => movie.rating >= 8.0)
    }

    // Filter by trending (viewCount >= 100)
    if (showTrending) {
      filtered = filtered.filter(movie => (movie.viewCount || 0) >= 100)
    }

    // Filter by featured content
    if (showFeatured) {
      filtered = filtered.filter(movie => movie.featuredContent && movie.featuredContent.isActive)
    }

    setFilteredMovies(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchQuery, selectedGenre, showTopRated, showTrending, showFeatured, movies])

  // Calculate pagination
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMovies = filteredMovies.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const fetchMovies = async () => {
    try {
      const response = await fetch("/api/back-office/movies")
      if (response.ok) {
        const data = await response.json()
        setMovies(data)
        setFilteredMovies(data)
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGenres = async () => {
    try {
      const response = await fetch("/api/back-office/genres")
      if (response.ok) {
        const data = await response.json()
        setGenres(data)
      }
    } catch (error) {
      console.error("Failed to fetch genres:", error)
    }
  }

  const handleDelete = async (movieId: string) => {
    if (!confirm("Are you sure you want to delete this movie?")) return

    try {
      const response = await fetch(`/api/back-office/movies/${movieId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setMovies(movies.filter(movie => movie.id !== movieId))
      } else {
        alert("Failed to delete movie")
      }
    } catch (error) {
      console.error("Failed to delete movie:", error)
      alert("Failed to delete movie")
    }
  }

  const toggleHeroSection = async (movieId: string) => {
    try {
      const movie = movies.find(m => m.id === movieId)
      const isCurrentlyInHero = movie?.heroSection && movie.heroSection.isActive

      const response = await fetch(`/api/back-office/movies/${movieId}/hero`, {
        method: isCurrentlyInHero ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sequence: isCurrentlyInHero ? null : Math.max(...movies.filter(m => m.heroSection).map(m => m.heroSection!.sequence), 0) + 1
        })
      })

      const data = await response.json()

      if (response.ok) {
        await fetchMovies()
        alert(data.message || "Hero section updated successfully")
      } else {
        alert(data.message || "Failed to update hero section")
      }
    } catch (error) {
      console.error("Failed to update hero section:", error)
      alert("Failed to update hero section")
    }
  }

  const toggleFeaturedContent = async (movieId: string) => {
    try {
      const movie = movies.find(m => m.id === movieId)
      const isCurrentlyFeatured = movie?.featuredContent && movie.featuredContent.isActive

      const response = await fetch(`/api/back-office/movies/${movieId}/featured`, {
        method: isCurrentlyFeatured ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sequence: isCurrentlyFeatured ? null : Math.max(...movies.filter(m => m.featuredContent).map(m => m.featuredContent!.sequence), 0) + 1
        })
      })

      const data = await response.json()

      if (response.ok) {
        await fetchMovies()
        alert(data.message || "Featured content updated successfully")
      } else {
        alert(data.message || "Failed to update featured content")
      }
    } catch (error) {
      console.error("Failed to update featured content:", error)
      alert("Failed to update featured content")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin-token")
    // Clear the cookie as well
    document.cookie = "admin-token=; path=/; max-age=0"
    router.push("/back-office")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-xflix-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-xflix-dark">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/back-office/dashboard" className="flex items-center">
                <span className="bg-xflix-red text-white font-black text-xl w-8 h-8 rounded flex items-center justify-center mr-2">
                  X
                </span>
                <span className="text-white font-bold text-xl">FLIX</span>
                <span className="ml-4 text-gray-400">Back Office</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/back-office/dashboard"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Movies Management</h1>
            <p className="text-gray-400">Manage your movie catalog</p>
          </div>
          <Link
            href="/back-office/movies/create"
            className="mt-4 sm:mt-0 bg-xflix-red hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Movie</span>
          </Link>
        </div>

        {/* Filters and Stats */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-80 bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-xflix-red focus:border-transparent"
                />
              </div>

              {/* Genre Filter */}
              <div className="relative">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full sm:w-48 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-xflix-red focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Top Rated Checkbox */}
              <div className="flex items-center space-x-2 px-4 py-2.5 border border-gray-700 rounded-lg bg-gray-800">
                <input
                  type="checkbox"
                  id="topRated"
                  checked={showTopRated}
                  onChange={(e) => setShowTopRated(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-gray-600 text-xflix-red focus:ring-xflix-red focus:ring-2 bg-gray-700"
                />
                <label htmlFor="topRated" className="text-gray-300 text-sm cursor-pointer flex items-center space-x-1">
                  <span>⭐</span>
                  <span>Top Rated (8.0+)</span>
                </label>
              </div>

              {/* Trending Checkbox */}
              <div className="flex items-center space-x-2 px-4 py-2.5 border border-gray-700 rounded-lg bg-gray-800">
                <input
                  type="checkbox"
                  id="trending"
                  checked={showTrending}
                  onChange={(e) => setShowTrending(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-gray-600 text-xflix-red focus:ring-xflix-red focus:ring-2 bg-gray-700"
                />
                <label htmlFor="trending" className="text-gray-300 text-sm cursor-pointer flex items-center space-x-1">
                  <span>🔥</span>
                  <span>Trending (100+ views)</span>
                </label>
              </div>

              {/* Featured Content Checkbox */}
              <div className="flex items-center space-x-2 px-4 py-2.5 border border-gray-700 rounded-lg bg-gray-800">
                <input
                  type="checkbox"
                  id="featured"
                  checked={showFeatured}
                  onChange={(e) => setShowFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-gray-600 text-xflix-red focus:ring-xflix-red focus:ring-2 bg-gray-700"
                />
                <label htmlFor="featured" className="text-gray-300 text-sm cursor-pointer flex items-center space-x-1">
                  <span>⭐</span>
                  <span>Featured Content</span>
                </label>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedGenre || showTopRated || showTrending || showFeatured) && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedGenre("")
                    setShowTopRated(false)
                    setShowTrending(false)
                    setShowFeatured(false)
                  }}
                  className="px-4 py-2.5 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg transition-colors whitespace-nowrap"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="text-gray-400 text-sm whitespace-nowrap">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredMovies.length)} of {filteredMovies.length} movies
              {(searchQuery || selectedGenre || showTopRated || showTrending || showFeatured) && (
                <span className="text-gray-500"> (filtered from {movies.length})</span>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedGenre || showTopRated || showTrending || showFeatured) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-gray-400 text-sm">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-900/30 text-blue-400 text-sm rounded-full border border-blue-700/30">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 hover:text-blue-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedGenre && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-900/30 text-green-400 text-sm rounded-full border border-green-700/30">
                  Genre: {genres.find(g => g.id === selectedGenre)?.name}
                  <button
                    onClick={() => setSelectedGenre("")}
                    className="ml-1 hover:text-green-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {showTopRated && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-900/30 text-yellow-400 text-sm rounded-full border border-yellow-700/30">
                  ⭐ Top Rated (8.0+)
                  <button
                    onClick={() => setShowTopRated(false)}
                    className="ml-1 hover:text-yellow-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {showTrending && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-900/30 text-orange-400 text-sm rounded-full border border-orange-700/30">
                  🔥 Trending (100+ views)
                  <button
                    onClick={() => setShowTrending(false)}
                    className="ml-1 hover:text-orange-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {showFeatured && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-900/30 text-purple-400 text-sm rounded-full border border-purple-700/30">
                  ⭐ Featured Content
                  <button
                    onClick={() => setShowFeatured(false)}
                    className="ml-1 hover:text-purple-300"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Movies Table */}
        <div className="bg-black/40 backdrop-blur-md rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-gray-700">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Movie</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Year</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Type</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Rating</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Duration</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Views</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">URLs</th>
                  <th className="text-right py-4 px-6 text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentMovies.map((movie, index) => {
                  const isInHero = movie.heroSection && movie.heroSection.isActive
                  const isFeatured = movie.featuredContent && movie.featuredContent.isActive

                  let borderClasses = ''
                  if (isInHero && isFeatured) {
                    borderClasses = 'border-r-[10px] border-r-gradient-to-b border-r-red-500'
                    // Create a visual effect with both colors - red inner, blue outer
                    borderClasses = 'border-r-[5px] border-r-red-500 relative after:absolute after:right-0 after:top-0 after:bottom-0 after:w-[5px] after:bg-blue-500'
                  } else if (isInHero) {
                    borderClasses = 'border-r-[5px] border-r-red-500'
                  } else if (isFeatured) {
                    borderClasses = 'border-r-[5px] border-r-blue-500'
                  }

                  return (
                  <tr key={movie.id} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${index % 2 === 0 ? 'bg-gray-900/20' : 'bg-transparent'} ${borderClasses}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-16 relative rounded-md overflow-hidden bg-gray-700 flex-shrink-0">
                          {movie.posterUrl ? (
                            <Image
                              src={movie.posterUrl}
                              alt={movie.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-white font-semibold truncate">{movie.title}</h3>
                          <p className="text-gray-400 text-sm truncate max-w-xs">{movie.overview}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{movie.year}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        movie.type === 'MOVIE'
                          ? 'bg-blue-900/30 text-blue-400 border border-blue-700/30'
                          : 'bg-green-900/30 text-green-400 border border-green-700/30'
                      }`}>
                        {movie.type === 'MOVIE' ? 'Movie' : 'TV Show'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-gray-300">{movie.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{movie.durationMin} min</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                          (movie.viewCount || 0) >= 100
                            ? 'bg-orange-900/30 text-orange-400 border border-orange-700/30'
                            : 'bg-gray-900/30 text-gray-400 border border-gray-700/30'
                        }`}>
                          <span>👀</span>
                          <span>{movie.viewCount || 0}</span>
                        </span>
                        {(movie.viewCount || 0) >= 100 && (
                          <span className="text-xs text-orange-400">🔥</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        (movie.streamingUrls?.length || 0) > 0
                          ? 'bg-green-900/30 text-green-400 border border-green-700/30'
                          : 'bg-red-900/30 text-red-400 border border-red-700/30'
                      }`}>
                        {movie.streamingUrls?.length || 0} URL{(movie.streamingUrls?.length || 0) !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => toggleHeroSection(movie.id)}
                          className={`p-2 rounded-md transition-colors ${
                            isInHero
                              ? 'text-red-400 bg-red-400/20 hover:bg-red-400/30'
                              : 'text-gray-400 hover:bg-gray-600/20 hover:text-red-400'
                          }`}
                          title={isInHero ? "Remove from hero section" : "Add to hero section"}
                        >
                          🎬
                        </button>
                        <button
                          onClick={() => toggleFeaturedContent(movie.id)}
                          className={`p-2 rounded-md transition-colors ${
                            isFeatured
                              ? 'text-blue-400 bg-blue-400/20 hover:bg-blue-400/30'
                              : 'text-gray-400 hover:bg-gray-600/20 hover:text-blue-400'
                          }`}
                          title={isFeatured ? "Remove from featured content" : "Add to featured content"}
                        >
                          🎥
                        </button>
                        <Link
                          href={`/back-office/movies/edit/${movie.id}`}
                          className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-md transition-colors"
                          title="Edit movie"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className="p-2 text-red-400 hover:bg-red-400/20 rounded-md transition-colors"
                          title="Delete movie"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {currentMovies.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-400">
                {searchQuery ? "No movies found matching your search." : "No movies found."}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 bg-black/40 backdrop-blur-md rounded-lg border border-gray-800 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              {filteredMovies.length > 0 ? (
                <>Page {currentPage} of {totalPages} • Total: {filteredMovies.length} movies</>
              ) : (
                <>No movies to display</>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  <span>←</span>
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`w-12 h-12 rounded-xl font-semibold transition-all duration-200 hover:scale-110 ${
                          currentPage === pageNumber
                            ? 'bg-gradient-to-r from-xflix-red to-red-700 text-white shadow-lg shadow-red-500/30'
                            : 'text-gray-300 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  <span>Next</span>
                  <span>→</span>
                </button>
              </div>
            )}

            {totalPages <= 1 && filteredMovies.length > 0 && (
              <div className="text-gray-500 text-sm">
                All movies are displayed on this page
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}