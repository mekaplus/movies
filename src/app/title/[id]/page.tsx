"use client"

import Image from "next/image"
import { notFound } from "next/navigation"
import { Play, Plus, ThumbsUp, ArrowLeft, ChevronDown, Info } from "@/components/common/icons"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/common/button"
import { ContentSection } from "@/components/sections/content-section"
import { Navbar } from "@/components/navbar/navbar"
import { ViewTracker } from "@/components/movie/view-tracker"
import { Movie } from "@/lib/types"
import { formatDuration, formatYear } from "@/lib/utils"

interface MovieDetailPageProps {
  params: Promise<{ id: string }>
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [movieId, setMovieId] = useState<string>("")
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>("")
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number>(0)

  useEffect(() => {
    const getParams = async () => {
      const { id } = await params
      setMovieId(id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    const fetchData = async () => {
      if (!movieId) return

      setLoading(true)
      try {
        const [movieResponse, similarResponse] = await Promise.all([
          fetch(`/api/movies/${movieId}`),
          fetch(`/api/movies/${movieId}/similar`)
        ])

        if (!movieResponse.ok) {
          notFound()
          return
        }

        const movieData = await movieResponse.json()
        const similarData = similarResponse.ok ? await similarResponse.json() : []

        setMovie(movieData)
        setSimilarMovies(similarData)

        // Set the first streaming URL as default
        if (movieData.streamingUrls && movieData.streamingUrls.length > 0) {
          setCurrentStreamUrl(movieData.streamingUrls[0].url)
        }
      } catch (error) {
        console.error('Error fetching movie data:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [movieId])

  if (loading) {
    return (
      <div className="movie-detail">
        <Navbar />
        <div className="movie-detail-hero">
          <div className="movie-detail-content">
            <div className="content-container">
              <div className="loading-spinner">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!movie) {
    notFound()
  }

  const directors = movie.credits.filter(credit => credit.role === "DIRECTOR")
  const actors = movie.credits.filter(credit => credit.role === "ACTOR").slice(0, 12)
  const writers = movie.credits.filter(credit => credit.role === "WRITER").slice(0, 3)

  return (
    <div className="movie-detail">
      <ViewTracker movieId={movieId} />
      <Navbar />

      {/* Hero Section */}
      <div className="movie-detail-hero">
        <div className="movie-detail-bg">
          {movie.backdropUrl && (
            <Image
              src={movie.backdropUrl}
              alt={movie.title}
              fill
              className="movie-detail-bg-image"
              priority
            />
          )}
          <div className="movie-detail-overlay" />
          <div className="movie-detail-gradient" />
        </div>

        <div className="movie-detail-content">
          <div className="movie-detail-back">
            <Link href="/" className="movie-detail-back-btn">
              <ArrowLeft />
              <span>Back</span>
            </Link>
          </div>

          {movie?.streamingUrls && movie.streamingUrls.length > 0 && (
            <div className="movie-detail-player">
              <iframe
                src={currentStreamUrl}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="movie-detail-iframe"
              />
            </div>
          )}

          {movie.streamingUrls && movie.streamingUrls.length > 0 && (
            <div className="movie-detail-play-buttons">
              {movie.streamingUrls.map((streamUrl, index) => (
                <Button
                  key={streamUrl.id}
                  className={`movie-detail-play-btn ${
                    selectedPlayerIndex === index ? 'movie-detail-play-btn-selected' : ''
                  }`}
                  onClick={() => {
                    setCurrentStreamUrl(streamUrl.url)
                    setSelectedPlayerIndex(index)
                  }}
                >
                  <Play />
                  <span>Player {index + 1}</span>
                </Button>
              ))}
            </div>
          )}

          <div className="movie-detail-main">
            <div className="movie-detail-info">
              <h1 className="movie-detail-title">{movie.title}</h1>

              <div className="movie-detail-meta">
                <div className="movie-detail-rating">
                  <span className="movie-detail-match">98% Match</span>
                </div>
                <span className="movie-detail-year">{formatYear(movie.year)}</span>
                <span className="movie-detail-duration">{formatDuration(movie.durationMin)}</span>
                <span className="movie-detail-quality">4K Ultra HD</span>
                <span className="movie-detail-audio">5.1</span>
              </div>

              <p className="movie-detail-overview">{movie.overview}</p>

              <div className="movie-detail-actions">
                <button className="movie-detail-action-btn">
                  <Plus />
                </button>
                <button className="movie-detail-action-btn">
                  <ThumbsUp />
                </button>
              </div>
            </div>

            <div className="movie-detail-poster">
              {movie.posterUrl && (
                <div className="movie-detail-poster-container">
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    width={300}
                    height={350}
                    className="movie-detail-poster-image"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="movie-detail-sections">
        <div className="movie-detail-container">
          <div className="movie-detail-grid">
            {/* Main Content */}
            <div className="movie-detail-main-content">
              {/* Genres */}
              <div className="movie-detail-genres">
                <h3 className="movie-detail-section-title">Genres</h3>
                <div className="movie-detail-genre-list">
                  {movie.genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/genre/${genre.id}`}
                      className="movie-detail-genre-tag"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Cast */}
              {actors.length > 0 && (
                <div className="movie-detail-cast">
                  <h3 className="movie-detail-section-title">Cast</h3>
                  <div className="movie-detail-cast-grid">
                    {actors.map((actor) => (
                      <div key={actor.id} className="movie-detail-cast-member">
                        <div className="movie-detail-cast-photo">
                          {actor.person.profileUrl ? (
                            <Image
                              src={actor.person.profileUrl}
                              alt={actor.person.name}
                              width={60}
                              height={60}
                              className="movie-detail-cast-image"
                            />
                          ) : (
                            <div className="movie-detail-cast-placeholder">
                              {actor.person.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="movie-detail-cast-info">
                          <h4 className="movie-detail-cast-name">{actor.person.name}</h4>
                          {actor.character && (
                            <p className="movie-detail-cast-character">{actor.character}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="movie-detail-sidebar">
              {/* Movie Stats */}
              <div className="movie-detail-stats">
                <div className="movie-detail-stat">
                  <span className="movie-detail-stat-label">Rating</span>
                  <div className="movie-detail-stat-value">
                    <span className="movie-detail-stat-number">{movie.rating}</span>
                    <span className="movie-detail-stat-max">/10</span>
                  </div>
                </div>
                <div className="movie-detail-stat">
                  <span className="movie-detail-stat-label">Release Year</span>
                  <span className="movie-detail-stat-value">{movie.year}</span>
                </div>
                <div className="movie-detail-stat">
                  <span className="movie-detail-stat-label">Duration</span>
                  <span className="movie-detail-stat-value">{formatDuration(movie.durationMin)}</span>
                </div>
              </div>

              {/* Crew */}
              {directors.length > 0 && (
                <div className="movie-detail-crew">
                  <h4 className="movie-detail-crew-title">
                    Director{directors.length > 1 ? 's' : ''}
                  </h4>
                  <div className="movie-detail-crew-list">
                    {directors.map((director, index) => (
                      <span key={director.id} className="movie-detail-crew-name">
                        {director.person.name}
                        {index < directors.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {writers.length > 0 && (
                <div className="movie-detail-crew">
                  <h4 className="movie-detail-crew-title">
                    Writer{writers.length > 1 ? 's' : ''}
                  </h4>
                  <div className="movie-detail-crew-list">
                    {writers.map((writer, index) => (
                      <span key={writer.id} className="movie-detail-crew-name">
                        {writer.person.name}
                        {index < writers.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div className="movie-detail-similar">
          <div className="content-container">
            <ContentSection
              title="More Like This"
              movies={similarMovies}
              count={similarMovies.length}
            />
          </div>
        </div>
      )}
    </div>
  )
}