import { NextRequest, NextResponse } from "next/server"
import { getMovieById } from "@/lib/repos/movie-repo"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const movie = await getMovieById(id)

    if (!movie) {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(movie)
  } catch (error) {
    console.error("Error fetching movie:", error)
    return NextResponse.json(
      { error: "Failed to fetch movie" },
      { status: 500 }
    )
  }
}