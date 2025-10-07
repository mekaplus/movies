import { NextRequest, NextResponse } from 'next/server'
import { getSimilarMovies } from '@/lib/repos/movie-repo'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const similarMovies = await getSimilarMovies(id)

    return NextResponse.json(similarMovies)
  } catch (error) {
    console.error('Error fetching similar movies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch similar movies' },
      { status: 500 }
    )
  }
}