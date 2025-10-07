'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  movieId: string
}

export function ViewTracker({ movieId }: ViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch(`/api/movies/${movieId}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      } catch (error) {
        console.error('Failed to track movie view:', error)
      }
    }

    trackView()
  }, [movieId])

  return null
}