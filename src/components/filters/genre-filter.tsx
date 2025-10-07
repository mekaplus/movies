"use client"

import { useState, useEffect } from "react"
import { Genre } from "@/lib/types"
import { cn } from "@/lib/utils"

interface GenreFilterProps {
  selectedGenres: string[]
  onGenresChange: (genres: string[]) => void
}

export function GenreFilter({ selectedGenres, onGenresChange }: GenreFilterProps) {
  const [genres, setGenres] = useState<Genre[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('/api/genres')
        if (!response.ok) {
          throw new Error('Failed to fetch genres')
        }
        const genresList = await response.json()
        setGenres(genresList)
      } catch (error) {
        console.error("Failed to fetch genres:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGenres()
  }, [])

  const handleGenreToggle = (genreId: string) => {
    const newSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId]

    onGenresChange(newSelectedGenres)
  }

  const clearAllFilters = () => {
    onGenresChange([])
  }

  if (loading) {
    return (
      <div className="genre-filter">
        <div className="genre-filter-header">
          <h3 className="genre-filter-title">Filter by Genre</h3>
        </div>
        <div className="genre-filter-loading">
          <div className="genre-filter-skeleton" />
          <div className="genre-filter-skeleton" />
          <div className="genre-filter-skeleton" />
        </div>
      </div>
    )
  }

  const visibleGenres = isExpanded ? genres : genres.slice(0, 8)

  return (
    <div className="genre-filter">
      <div className="genre-filter-header">
        <h3 className="genre-filter-title">Filter by Genre</h3>
        {selectedGenres.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="genre-filter-clear"
          >
            Clear All ({selectedGenres.length})
          </button>
        )}
      </div>

      <div className="genre-filter-grid">
        {visibleGenres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenreToggle(genre.id)}
            className={cn(
              "genre-filter-item",
              selectedGenres.includes(genre.id) && "genre-filter-item-selected"
            )}
          >
            <span className="genre-filter-item-name">{genre.name}</span>
            <span className="genre-filter-item-count">
              {selectedGenres.includes(genre.id) ? "✓" : "+"}
            </span>
          </button>
        ))}
      </div>

      {genres.length > 8 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="genre-filter-toggle"
        >
          {isExpanded ? "Show Less" : `Show All (${genres.length})`}
        </button>
      )}

      {selectedGenres.length > 0 && (
        <div className="genre-filter-selected">
          <span className="genre-filter-selected-label">Selected:</span>
          <div className="genre-filter-selected-list">
            {selectedGenres.map((genreId) => {
              const genre = genres.find(g => g.id === genreId)
              return genre ? (
                <span
                  key={genreId}
                  className="genre-filter-selected-item"
                  onClick={() => handleGenreToggle(genreId)}
                >
                  {genre.name}
                  <span className="genre-filter-selected-remove">×</span>
                </span>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}