"use client"

import Link from "next/link"
import Image from "next/image"
import { Play } from "@/components/common/icons"
import { Movie } from "@/lib/types"
import { formatYear } from "@/lib/utils"

interface FeaturedGridProps {
  title: string
  movies: Movie[]
}

export function FeaturedGrid({ title, movies }: FeaturedGridProps) {
  if (!movies.length) return null

  return (
    <section className="featured-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
      </div>

      <div className="featured-grid">
        {movies.map((movie, index) => (
          <article key={movie.id} className="featured-card">
            <div className="featured-poster">
              {movie.posterUrl ? (
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  width={200}
                  height={300}
                  className="featured-poster-image"
                  priority={index < 8}
                />
              ) : (
                <div className="featured-poster-placeholder">
                  <span>{movie.title}</span>
                </div>
              )}

              <div className="featured-rating">{movie.rating.toFixed(1)}</div>
              <div className="featured-badge">Featured</div>

              <Link href={`/title/${movie.id}`} className="featured-play-overlay">
                <div className="featured-play-icon">
                  <Play />
                </div>
              </Link>
            </div>

            <div className="featured-info">
              <h3 className="featured-title">
                <Link href={`/title/${movie.id}`}>{movie.title}</Link>
              </h3>
              <span className="featured-year">{formatYear(movie.year)}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}