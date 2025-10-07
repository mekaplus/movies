"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, Eye } from "@/components/common/icons"
import { Movie } from "@/lib/types"
import { formatYear } from "@/lib/utils"

interface ContentSectionProps {
  title: string
  movies: Movie[]
  count: number
  viewAllHref?: string
}

export function ContentSection({ title, movies, count, viewAllHref }: ContentSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = 220 // Approximate width of one card including gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      })
    }
  }

  const autoScroll = () => {
    if (scrollRef.current) {
      const container = scrollRef.current
      const cardWidth = 220 // Approximate width of one card including gap
      const maxScroll = container.scrollWidth - container.clientWidth

      if (container.scrollLeft >= maxScroll) {
        // Reset to beginning when reaching the end
        container.scrollTo({
          left: 0,
          behavior: "smooth"
        })
      } else {
        // Scroll one card to the right
        container.scrollBy({
          left: cardWidth,
          behavior: "smooth"
        })
      }
    }
  }

  // Auto scroll effect
  useEffect(() => {
    if (movies.length > 0) {
      autoScrollIntervalRef.current = setInterval(autoScroll, 2000)
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
    }
  }, [movies.length])

  // Pause auto scroll on hover
  const handleMouseEnter = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current)
      autoScrollIntervalRef.current = null
    }
  }

  // Resume auto scroll on mouse leave
  const handleMouseLeave = () => {
    if (!autoScrollIntervalRef.current) {
      autoScrollIntervalRef.current = setInterval(autoScroll, 2000)
    }
  }

  if (!movies.length) return null

  return (
    <section className="content-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <div className="section-header-right">
          {viewAllHref && (
            <Link href="/movies" className="section-view-all">
              View All
            </Link>
          )}
        </div>
      </div>

      <div className="content-row-container">
        <div className="content-scroll-controls">
          <button
            className="scroll-btn scroll-btn-left"
            onClick={() => scroll("left")}
          >
            <ChevronLeft />
          </button>
          <button
            className="scroll-btn scroll-btn-right"
            onClick={() => scroll("right")}
          >
            <ChevronRight />
          </button>
        </div>

        <div
          className="content-scroll"
          ref={scrollRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {movies.map((movie, index) => (
            <article key={movie.id} className="content-card">
              <div className="content-poster">
                {movie.posterUrl ? (
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    width={200}
                    height={300}
                    className="content-poster-image"
                    priority={index < 6}
                  />
                ) : (
                  <div className="content-poster-placeholder">
                    <span>{movie.title}</span>
                  </div>
                )}

                <div className="content-rating">{movie.rating.toFixed(1)}</div>

                <div className="content-quality">HD</div>

                <Link href={`/title/${movie.id}`} className="content-play-overlay">
                  <div className="content-play-icon">
                    <Play />
                  </div>
                </Link>
              </div>

              <div className="content-info">
                <h3 className="content-title">
                  <Link href={`/title/${movie.id}`}>{movie.title}</Link>
                </h3>
                <div className="content-meta">
                  <span className="content-year">{formatYear(movie.year)}</span>
                  {movie.viewCount !== undefined && (
                    <div className="content-views">
                      <Eye className="content-eye-icon" />
                      <span>{movie.viewCount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}