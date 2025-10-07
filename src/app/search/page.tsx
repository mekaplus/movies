"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "@/components/common/icons"

import { Navbar } from "@/components/navbar/navbar"
import { TitleCard } from "@/components/cards/title-card"
import { Movie } from "@/lib/types"

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const searchMovies = async () => {
      if (!query.trim()) {
        setMovies([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/titles?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setMovies(data)
        }
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchMovies, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  return (
    <>
      <Navbar />

      <div className="pt-20 px-8 md:px-12 lg:px-16">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for movies and TV shows..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-xflix-red focus:border-transparent"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-400 py-8">
            Searching...
          </div>
        )}

        {!loading && query.trim() && movies.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No results found for &quot;{query}&quot;
          </div>
        )}

        {movies.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Search Results for &quot;{query}&quot;
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <TitleCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {!query.trim() && (
          <div className="text-center text-gray-400 py-16">
            <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl">Search for your favorite movies and TV shows</p>
          </div>
        )}
      </div>
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <div className="pt-20 px-8 md:px-12 lg:px-16">
          <div className="text-center text-gray-400 py-8">
            Loading...
          </div>
        </div>
      </>
    }>
      <SearchContent />
    </Suspense>
  )
}