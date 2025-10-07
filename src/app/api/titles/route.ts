import { NextRequest, NextResponse } from "next/server"
import { getMovies, getMoviesByGenre, getMoviesByType, searchMovies } from "@/lib/repos/movie-repo"
import { MediaType } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const genre = searchParams.get("genre")
    const type = searchParams.get("type") as MediaType | null
    const query = searchParams.get("q")

    let movies

    if (query) {
      movies = await searchMovies(query)
    } else if (genre) {
      movies = await getMoviesByGenre(genre)
    } else if (type) {
      movies = await getMoviesByType(type)
    } else {
      movies = await getMovies()
    }

    return NextResponse.json(movies)
  } catch (error) {
    console.error("Error fetching titles:", error)
    return NextResponse.json(
      { error: "Failed to fetch titles" },
      { status: 500 }
    )
  }
}