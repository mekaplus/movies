"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Play, Info } from "@/components/common/icons"
import { Button } from "@/components/common/button"
import { Movie } from "@/lib/types"
import { formatDuration, formatYear } from "@/lib/utils"

interface HeroCarouselProps {
  movies: Movie[]
}

export function HeroCarousel({ movies }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (movies.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movies.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [movies.length])

  if (!movies.length) return null

  const currentMovie = movies[currentSlide]

  return (
    <div className="hero-carousel">
      <div className="hero-carousel-container">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="hero-slide-bg">
              {movie.backdropUrl && (
                <Image
                  src={movie.backdropUrl}
                  alt={movie.title}
                  fill
                  className="hero-bg-image"
                  priority={index === 0}
                />
              )}
            </div>

            <div className="hero-slide-content">
              <div className="hero-content-wrapper">
                <div className="hero-badge">
                  <span className="hero-logo">N</span>
                  <span className="hero-type">MOVIE</span>
                </div>

                <h1 className="hero-title">{movie.title}</h1>

                <div className="hero-meta">
                  <span className="hero-match">95% Match</span>
                  <span className="hero-year">{formatYear(movie.year)}</span>
                  <span className="hero-rating">HD</span>
                  <span className="hero-duration">{formatDuration(movie.durationMin)}</span>
                </div>

                <p className="hero-synopsis">
                  {movie.overview && movie.overview.length > 200
                    ? movie.overview.substring(0, 200) + "..."
                    : movie.overview
                  }
                </p>

                <div className="hero-actions">
                  <Link href={`/title/${movie.id}`}>
                    <Button className="hero-play-btn">
                      <Play className="hero-play-icon" />
                      <span>Play</span>
                    </Button>
                  </Link>
                  <Link href={`/title/${movie.id}`}>
                    <Button variant="secondary" className="hero-info-btn">
                      <Info className="hero-info-icon" />
                      <span>More Info</span>
                    </Button>
                  </Link>
                </div>

                <div className="hero-genres">
                  <span>Genres: </span>
                  {movie.genres.slice(0, 3).map((genre, idx) => (
                    <span key={genre.id}>
                      {idx > 0 && ", "}
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-pagination">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}