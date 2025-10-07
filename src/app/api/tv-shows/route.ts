import { NextResponse } from 'next/server'
import { getMoviesByType } from '@/lib/repos/movie-repo'

export async function GET() {
  try {
    const tvShows = await getMoviesByType('TV_SHOW')
    return NextResponse.json(tvShows)
  } catch (error) {
    console.error('Error fetching TV shows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch TV shows' },
      { status: 500 }
    )
  }
}