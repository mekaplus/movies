import { NextRequest, NextResponse } from 'next/server'
import { getMoviesByGenres, getAllMovies } from '@/lib/repos/movie-repo'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const genresParam = searchParams.get('genres')

    if (!genresParam) {
      const allMovies = await getAllMovies()
      return NextResponse.json(allMovies)
    }

    const genreIds = genresParam.split(',').filter(Boolean)
    const movies = await getMoviesByGenres(genreIds)

    return NextResponse.json(movies)
  } catch (error) {
    console.error('Error fetching movies by genres:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    )
  }
}