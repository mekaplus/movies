"use client"

import { Play, Info } from "@/components/common/icons"
import { Button } from "@/components/common/button"
import { Movie } from "@/lib/types"
import { formatDuration, formatYear } from "@/lib/utils"

interface HeroBannerProps {
  movie: Movie
}

export function HeroBanner({ movie }: HeroBannerProps) {
  return (
    <div className="xflix-hero">
      {/* Background Image */}
      <div
        className="xflix-hero-bg"
        style={{
          backgroundImage: movie.backdropUrl ? `url(${movie.backdropUrl})` : undefined,
        }}
      />

      {/* Gradient Overlays */}
      <div className="xflix-hero-gradient-bottom" />
      <div className="xflix-hero-gradient-left" />
      <div className="xflix-hero-vignette" />

      {/* Content */}
      <div className="xflix-hero-content">
        <div className="xflix-hero-info">
          {/* Xflix Logo or Series Badge */}
          <div className="xflix-series-badge">
            <span className="xflix-logo">X</span>
            <span className="xflix-series-text">SERIES</span>
          </div>

          {/* Title */}
          <h1 className="xflix-hero-title">
            {movie.title}
          </h1>

          {/* Metadata */}
          <div className="xflix-hero-meta">
            <span className="xflix-match">98% Match</span>
            <span className="xflix-year">{formatYear(movie.year)}</span>
            <span className="xflix-rating">U/A 16+</span>
            <span className="xflix-duration">{formatDuration(movie.durationMin)}</span>
            <span className="xflix-quality">HD</span>
          </div>

          {/* Synopsis */}
          <p className="xflix-hero-synopsis">
            {movie.overview}
          </p>

          {/* Action Buttons */}
          <div className="xflix-hero-buttons">
            <button className="xflix-play-btn">
              <Play className="xflix-play-icon" />
              <span>Play</span>
            </button>
            <button className="xflix-info-btn">
              <Info className="xflix-info-icon" />
              <span>More Info</span>
            </button>
          </div>

          {/* Genres */}
          <div className="xflix-hero-genres">
            <span>Genres:</span>
            {movie.genres.slice(0, 3).map((genre, index) => (
              <span key={genre.id}>
                {index > 0 && ", "}
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}