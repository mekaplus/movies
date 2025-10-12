/**
 * Google Analytics utility functions
 *
 * This module provides helper functions for tracking custom events in Google Analytics 4.
 * Events are only sent when GA_MEASUREMENT_ID is configured and gtag is available.
 */

// Type definitions for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set',
      targetId: string,
      config?: Record<string, unknown>
    ) => void
  }
}

/**
 * Check if Google Analytics is enabled
 */
export function isGAEnabled(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID &&
    typeof window !== 'undefined' &&
    window.gtag
  )
}

/**
 * Track a custom event in Google Analytics
 *
 * @param eventName - Name of the event (e.g., 'select_player', 'search')
 * @param parameters - Event parameters
 */
export function trackEvent(
  eventName: string,
  parameters?: Record<string, unknown>
): void {
  if (!isGAEnabled()) {
    return
  }

  try {
    window.gtag!('event', eventName, parameters)
  } catch (error) {
    console.error('Failed to track GA event:', error)
  }
}

/**
 * Track when a user views content (movie/TV show detail page)
 */
export function trackContentView(params: {
  contentId: string
  contentTitle: string
  contentType: 'movie' | 'tv_show'
  genres?: string[]
  year?: number
  rating?: number
}): void {
  trackEvent('view_content', {
    content_id: params.contentId,
    content_title: params.contentTitle,
    content_type: params.contentType,
    genres: params.genres?.join(', '),
    year: params.year,
    rating: params.rating,
  })
}

/**
 * Track when a user selects a player (Player 1, Player 2, etc.)
 */
export function trackPlayerSelection(params: {
  contentId: string
  contentTitle: string
  contentType: 'movie' | 'tv_show'
  playerNumber: number
  quality?: string
  platform?: string
  episodeId?: string
  seasonNumber?: number
  episodeNumber?: number
}): void {
  trackEvent('select_player', {
    content_id: params.contentId,
    content_title: params.contentTitle,
    content_type: params.contentType,
    player_number: params.playerNumber,
    quality: params.quality,
    platform: params.platform,
    episode_id: params.episodeId,
    season_number: params.seasonNumber,
    episode_number: params.episodeNumber,
  })
}

/**
 * Track when a user watches a trailer
 */
export function trackTrailerView(params: {
  contentId: string
  contentTitle: string
  contentType: 'movie' | 'tv_show'
}): void {
  trackEvent('watch_trailer', {
    content_id: params.contentId,
    content_title: params.contentTitle,
    content_type: params.contentType,
  })
}

/**
 * Track when a user selects an episode (TV shows)
 */
export function trackEpisodeSelection(params: {
  showId: string
  showTitle: string
  episodeId: string
  episodeTitle: string
  seasonNumber: number
  episodeNumber: number
}): void {
  trackEvent('select_episode', {
    show_id: params.showId,
    show_title: params.showTitle,
    episode_id: params.episodeId,
    episode_title: params.episodeTitle,
    season_number: params.seasonNumber,
    episode_number: params.episodeNumber,
  })
}

/**
 * Track when a user clicks on a title card
 */
export function trackTitleCardClick(params: {
  contentId: string
  contentTitle: string
  contentType: 'movie' | 'tv_show'
  position?: number
  sectionTitle?: string
}): void {
  trackEvent('select_content', {
    content_id: params.contentId,
    content_title: params.contentTitle,
    content_type: params.contentType,
    position: params.position,
    section_title: params.sectionTitle,
  })
}

/**
 * Track search queries
 */
export function trackSearch(params: {
  searchTerm: string
  resultsCount?: number
}): void {
  trackEvent('search', {
    search_term: params.searchTerm,
    results_count: params.resultsCount,
  })
}

/**
 * Track when a user adds/removes from their list
 */
export function trackListAction(params: {
  action: 'add' | 'remove'
  contentId: string
  contentTitle: string
  contentType: 'movie' | 'tv_show'
}): void {
  const eventName = params.action === 'add' ? 'add_to_list' : 'remove_from_list'

  trackEvent(eventName, {
    content_id: params.contentId,
    content_title: params.contentTitle,
    content_type: params.contentType,
  })
}

/**
 * Track hero carousel interactions
 */
export function trackHeroInteraction(params: {
  action: 'play' | 'info' | 'next' | 'prev'
  contentId: string
  contentTitle: string
  position: number
}): void {
  trackEvent('hero_interaction', {
    action: params.action,
    content_id: params.contentId,
    content_title: params.contentTitle,
    carousel_position: params.position,
  })
}

/**
 * Track when a user browses by genre
 */
export function trackGenreView(params: {
  genreId: string
  genreName: string
  resultsCount?: number
}): void {
  trackEvent('view_category', {
    genre_id: params.genreId,
    genre_name: params.genreName,
    results_count: params.resultsCount,
  })
}
