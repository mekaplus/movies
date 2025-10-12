'use client'

import { useEffect } from 'react'
import { trackContentView } from '@/lib/analytics'

interface ViewTrackerProps {
  movieId: string
  movieTitle?: string
  contentType?: 'movie' | 'tv_show'
  genres?: string[]
  year?: number
  rating?: number
}

export function ViewTracker({
  movieId,
  movieTitle,
  contentType,
  genres,
  year,
  rating
}: ViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      try {
        // Track in our database
        await fetch(`/api/movies/${movieId}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        // Track in Google Analytics (if info is provided)
        if (movieTitle && contentType) {
          trackContentView({
            contentId: movieId,
            contentTitle: movieTitle,
            contentType,
            genres,
            year,
            rating,
          })
        }
      } catch (error) {
        console.error('Failed to track movie view:', error)
      }
    }

    trackView()
  }, [movieId, movieTitle, contentType, genres, year, rating])

  return null
}