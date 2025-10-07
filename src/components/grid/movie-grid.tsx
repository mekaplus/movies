"use client"

import Link from "next/link"
import Image from "next/image"
import { Play, Eye } from "@/components/common/icons"
import { Movie } from "@/lib/types"
import { formatYear } from "@/lib/utils"
import { formatViewCount } from "@/lib/utils/format-number"

interface MovieGridProps {
  movies: Movie[]
}

export function MovieGrid({ movies }: MovieGridProps) {
  if (!movies.length) {
    return (
      <div className="empty-state">
        <p>No movies found</p>
      </div>
    )
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <article key={movie.id} className="movie-grid-card">
          <div className="movie-grid-poster">
            {movie.posterUrl ? (
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                width={200}
                height={300}
                className="movie-grid-poster-image"
              />
            ) : (
              <div className="movie-grid-poster-placeholder">
                <span>{movie.title}</span>
              </div>
            )}

            <div className="movie-grid-rating">{movie.rating.toFixed(1)}</div>
            <div className="movie-grid-quality">HD</div>

            <Link href={`/title/${movie.id}`} className="movie-grid-play-overlay">
              <div className="movie-grid-play-icon">
                <Play />
              </div>
            </Link>
          </div>

          <div className="movie-grid-info">
            <h3 className="movie-grid-title">
              <Link href={`/title/${movie.id}`}>{movie.title}</Link>
            </h3>
            <div className="movie-grid-meta">
              <span className="movie-grid-year">{formatYear(movie.year)}</span>
              {movie.genres.length > 0 && (
                <>
                  <span className="movie-grid-separator">•</span>
                  <span className="movie-grid-genre">{movie.genres[0].name}</span>
                </>
              )}
              {movie.viewCount !== undefined && (
                <>
                  <span className="movie-grid-separator">•</span>
                  <div className="movie-grid-views">
                    <Eye className="movie-grid-eye-icon" />
                    <span>{formatViewCount(movie.viewCount)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}