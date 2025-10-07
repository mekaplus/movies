"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, ChevronDown } from "@/components/common/icons"
import { Season, Episode } from "@/lib/types"
import { formatDuration } from "@/lib/utils"

interface SeasonsSectionProps {
  seasons: Season[]
  onEpisodeSelect: (episode: Episode) => void
  currentEpisodeId?: string
  defaultPosterUrl?: string | null
}

export function SeasonsSection({ seasons, onEpisodeSelect, currentEpisodeId, defaultPosterUrl }: SeasonsSectionProps) {
  const [expandedSeasons, setExpandedSeasons] = useState<Set<string>>(
    new Set(seasons.length > 0 ? [seasons[0].id] : [])
  )

  if (!seasons || seasons.length === 0) {
    return null
  }

  const toggleSeason = (seasonId: string) => {
    setExpandedSeasons(prev => {
      const newSet = new Set(prev)
      if (newSet.has(seasonId)) {
        newSet.delete(seasonId)
      } else {
        newSet.add(seasonId)
      }
      return newSet
    })
  }

  return (
    <div className="seasons-section">
      <h3 className="seasons-title">Episodes</h3>

      <div className="seasons-list">
        {seasons.map((season) => {
          const isExpanded = expandedSeasons.has(season.id)

          return (
            <div key={season.id} className="season-item">
              <button
                className="season-header"
                onClick={() => toggleSeason(season.id)}
              >
                <div className="season-info">
                  <h4 className="season-name">
                    {season.title || `Season ${season.seasonNumber}`}
                  </h4>
                  <span className="season-episode-count">
                    {season.episodes.length} Episode{season.episodes.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <ChevronDown
                  className={`season-chevron ${isExpanded ? 'rotated' : ''}`}
                />
              </button>

              {isExpanded && (
                <div className="episodes-list">
                  {season.episodes.map((episode) => {
                    const isCurrentEpisode = currentEpisodeId === episode.id

                    return (
                      <div
                        key={episode.id}
                        className={`episode-card ${isCurrentEpisode ? 'active' : ''}`}
                      >
                        <div className="episode-number">
                          {episode.episodeNumber}
                        </div>

                        <div className="episode-thumbnail">
                          {episode.stillUrl || defaultPosterUrl ? (
                            <Image
                              src={episode.stillUrl || defaultPosterUrl || ''}
                              alt={episode.title}
                              width={160}
                              height={90}
                              className="episode-thumbnail-image"
                            />
                          ) : (
                            <div className="episode-thumbnail-placeholder">
                              <Play className="episode-play-icon" />
                            </div>
                          )}

                          <button
                            className="episode-play-overlay"
                            onClick={() => onEpisodeSelect(episode)}
                          >
                            <Play className="episode-play-button" />
                          </button>
                        </div>

                        <div className="episode-info">
                          <div className="episode-header">
                            <h4 className="episode-title">{episode.title}</h4>
                            <span className="episode-duration">{formatDuration(episode.durationMin)}</span>
                          </div>

                          {episode.overview && (
                            <p className="episode-overview">{episode.overview}</p>
                          )}

                          {episode.streamingUrls && episode.streamingUrls.length > 0 && (
                            <div className="episode-players">
                              <span className="episode-players-label">
                                {episode.streamingUrls.length} Player{episode.streamingUrls.length !== 1 ? 's' : ''} Available
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}