"use client"

import Image from "next/image"
import { notFound } from "next/navigation"
import { Play, ArrowLeft, ChevronDown, Info } from "@/components/common/icons"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/common/button"
import { ContentSection } from "@/components/sections/content-section"
import { Navbar } from "@/components/navbar/navbar"
import { ViewTracker } from "@/components/movie/view-tracker"
import { SeasonsSection } from "@/components/tv/seasons-section"
import { Movie, Episode } from "@/lib/types"
import { formatDuration, formatYear } from "@/lib/utils"
import { trackPlayerSelection, trackTrailerView, trackEpisodeSelection } from "@/lib/analytics"

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
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)

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
          fetch(`/api/titles/${movieId}`),
          fetch(`/api/titles/${movieId}/similar`)
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
        if (movieData.type === 'MOVIE' && movieData.streamingUrls && movieData.streamingUrls.length > 0) {
          setCurrentStreamUrl(movieData.streamingUrls[0].url)
        } else if (movieData.type === 'TV_SHOW' && movieData.seasons && movieData.seasons.length > 0) {
          // For TV shows, set the first episode of the first season as default
          const firstSeason = movieData.seasons[0]
          if (firstSeason.episodes && firstSeason.episodes.length > 0) {
            const firstEpisode = firstSeason.episodes[0]
            setCurrentEpisode(firstEpisode)
            if (firstEpisode.streamingUrls && firstEpisode.streamingUrls.length > 0) {
              setCurrentStreamUrl(firstEpisode.streamingUrls[0].url)
            }
          }
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="loading-spinner text-white text-xl">Loading...</div>
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

  const handleEpisodeSelect = (episode: Episode) => {
    setCurrentEpisode(episode)
    setSelectedPlayerIndex(0)
    if (episode.streamingUrls && episode.streamingUrls.length > 0) {
      setCurrentStreamUrl(episode.streamingUrls[0].url)
    }

    // Track episode selection
    if (movie) {
      const season = movie.seasons?.find(s => s.id === episode.seasonId)
      trackEpisodeSelection({
        showId: movieId,
        showTitle: movie.title,
        episodeId: episode.id,
        episodeTitle: episode.title,
        seasonNumber: season?.seasonNumber || 1,
        episodeNumber: episode.episodeNumber,
      })
    }
  }

  return (
    <div className="movie-detail">
      <ViewTracker
        movieId={movieId}
        movieTitle={movie.title}
        contentType={movie.type === 'MOVIE' ? 'movie' : 'tv_show'}
        genres={movie.genres.map(g => g.name)}
        year={movie.year}
        rating={movie.rating}
      />
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

          {currentStreamUrl && (
            <div className="movie-detail-player">
              <iframe
                src={currentStreamUrl}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="movie-detail-iframe"
              />
            </div>
          )}

          {movie.trailerUrl && (
            <div className="movie-detail-play-buttons">
              <Button
                className="movie-detail-play-btn"
                onClick={() => {
                  // Track trailer view
                  trackTrailerView({
                    contentId: movieId,
                    contentTitle: movie.title,
                    contentType: movie.type === 'MOVIE' ? 'movie' : 'tv_show',
                  })
                  window.open(movie.trailerUrl, '_blank', 'noopener,noreferrer')
                }}
              >
                <Play />
                <span>Watch Trailer</span>
              </Button>
            </div>
          )}

          {movie.type === 'MOVIE' && movie.streamingUrls && movie.streamingUrls.length > 0 && (
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

                    // Track player selection
                    trackPlayerSelection({
                      contentId: movieId,
                      contentTitle: movie.title,
                      contentType: 'movie',
                      playerNumber: index + 1,
                      quality: streamUrl.quality || undefined,
                      platform: streamUrl.platform || undefined,
                    })
                  }}
                >
                  <Play />
                  <span>Player {index + 1}</span>
                </Button>
              ))}
            </div>
          )}

          {movie.type === 'TV_SHOW' && currentEpisode && currentEpisode.streamingUrls && currentEpisode.streamingUrls.length > 0 && (
            <div className="movie-detail-play-buttons">
              {currentEpisode.streamingUrls.map((streamUrl, index) => (
                <Button
                  key={streamUrl.id}
                  className={`movie-detail-play-btn ${
                    selectedPlayerIndex === index ? 'movie-detail-play-btn-selected' : ''
                  }`}
                  onClick={() => {
                    setCurrentStreamUrl(streamUrl.url)
                    setSelectedPlayerIndex(index)

                    // Track player selection for TV show episodes
                    const season = movie.seasons?.find(s => s.id === currentEpisode.seasonId)
                    trackPlayerSelection({
                      contentId: movieId,
                      contentTitle: movie.title,
                      contentType: 'tv_show',
                      playerNumber: index + 1,
                      quality: streamUrl.quality || undefined,
                      platform: streamUrl.platform || undefined,
                      episodeId: currentEpisode.id,
                      seasonNumber: season?.seasonNumber,
                      episodeNumber: currentEpisode.episodeNumber,
                    })
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
              <h1 className="movie-detail-title">
                {movie.title}
                {movie.type === 'TV_SHOW' && currentEpisode && movie.seasons && (
                  <span className="movie-detail-episode-info">
                    {' '}- S{movie.seasons.find(s => s.id === currentEpisode.seasonId)?.seasonNumber || 1} E{currentEpisode.episodeNumber}: {currentEpisode.title}
                  </span>
                )}
              </h1>

              <div className="movie-detail-meta">
                <div className="movie-detail-rating">
                  <span className="movie-detail-match">98% Match</span>
                </div>
                <span className="movie-detail-year">{formatYear(movie.year)}</span>
                {movie.type === 'MOVIE' && (
                  <span className="movie-detail-duration">{formatDuration(movie.durationMin)}</span>
                )}
                {movie.type === 'TV_SHOW' && movie.seasons && (
                  <span className="movie-detail-duration">
                    {movie.seasons.length} Season{movie.seasons.length > 1 ? 's' : ''}
                  </span>
                )}
                <span className="movie-detail-quality">4K Ultra HD</span>
                <span className="movie-detail-audio">5.1</span>
              </div>

              <div className="movie-detail-genres">
                {movie.genres.map((genre, index) => (
                  <span key={genre.id}>
                    <Link href={`/genre/${genre.id}`} className="movie-detail-genre-link">
                      {genre.name}
                    </Link>
                    {index < movie.genres.length - 1 && <span className="movie-detail-genre-separator"> • </span>}
                  </span>
                ))}
              </div>

              <p className="movie-detail-overview">{movie.overview}</p>
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

      {/* Seasons Section for TV Shows */}
      {movie.type === 'TV_SHOW' && movie.seasons && movie.seasons.length > 0 && (
        <div className="movie-detail-seasons">
          <div className="content-container">
            <SeasonsSection
              seasons={movie.seasons}
              onEpisodeSelect={handleEpisodeSelect}
              currentEpisodeId={currentEpisode?.id}
              defaultPosterUrl={movie.backdropUrl || movie.posterUrl}
            />
          </div>
        </div>
      )}

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