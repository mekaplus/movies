"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, LogOut, ChevronDown, ChevronUp } from "@/components/common/icons"
import { Genre, Movie, StreamingUrl, Season, Episode } from "@/lib/types"

interface StreamingUrlForm {
  id?: string
  url: string
  quality: string
  platform: string
  isActive: boolean
}

interface EpisodeStreamingUrlForm {
  id?: string
  url: string
  quality: string
  platform: string
  isActive: boolean
}

interface EpisodeForm {
  id?: string
  episodeNumber: number
  title: string
  overview: string
  durationMin: number
  rating: number
  stillUrl: string
  streamingUrls: EpisodeStreamingUrlForm[]
}

interface SeasonForm {
  id?: string
  seasonNumber: number
  title: string
  overview: string
  posterUrl: string
  episodes: EpisodeForm[]
}

export default function EditMovie({ params }: { params: Promise<{ id: string }> }) {
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [genres, setGenres] = useState<Genre[]>([])
  const [movieId, setMovieId] = useState<string>("")
  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form')
  const [jsonError, setJsonError] = useState<string>('')
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    year: new Date().getFullYear(),
    durationMin: 0,
    rating: 0,
    type: "MOVIE" as "MOVIE" | "TV_SHOW",
    posterUrl: "",
    backdropUrl: "",
    trailerUrl: "",
    genreIds: [] as string[]
  })
  const [streamingUrls, setStreamingUrls] = useState<StreamingUrlForm[]>([])
  const [seasons, setSeasons] = useState<SeasonForm[]>([])
  const [jsonData, setJsonData] = useState<string>('')
  const [expandedSeasons, setExpandedSeasons] = useState<Set<number>>(new Set())
  const router = useRouter()

  useEffect(() => {
    const getParams = async () => {
      const { id } = await params
      setMovieId(id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!movieId) return

    // Authentication is handled by middleware
    fetchGenres()
    fetchMovie()
  }, [movieId])

  // Sync form data to JSON whenever it changes
  useEffect(() => {
    if (!formData.title && pageLoading) return // Don't sync during initial load

    const payload = {
      ...formData,
      streamingUrls: formData.type === 'MOVIE' ? streamingUrls.filter(url => url.url.trim() !== "").map(({ id, ...rest }) => ({ ...(id && { id }), ...rest })) : [],
      ...(formData.type === 'TV_SHOW' && {
        seasons: seasons.map(season => ({
          ...(season.id && { id: season.id }),
          seasonNumber: season.seasonNumber,
          title: season.title,
          overview: season.overview,
          posterUrl: season.posterUrl,
          episodes: season.episodes.map(episode => ({
            ...(episode.id && { id: episode.id }),
            episodeNumber: episode.episodeNumber,
            title: episode.title,
            overview: episode.overview,
            durationMin: episode.durationMin,
            rating: episode.rating,
            stillUrl: episode.stillUrl,
            streamingUrls: episode.streamingUrls.filter(url => url.url.trim() !== "").map(({ id, ...rest }) => ({ ...(id && { id }), ...rest }))
          }))
        }))
      })
    }
    setJsonData(JSON.stringify(payload, null, 2))
  }, [formData, streamingUrls, seasons, pageLoading])

  const handleJsonChange = (value: string) => {
    setJsonData(value)
    setJsonError('')

    try {
      const parsed = JSON.parse(value)

      // Update form data
      setFormData({
        title: parsed.title || "",
        overview: parsed.overview || "",
        year: parsed.year || new Date().getFullYear(),
        durationMin: parsed.durationMin || 0,
        rating: parsed.rating || 0,
        type: parsed.type || "MOVIE",
        posterUrl: parsed.posterUrl || "",
        backdropUrl: parsed.backdropUrl || "",
        trailerUrl: parsed.trailerUrl || "",
        genreIds: parsed.genreIds || []
      })

      // Update streaming URLs for movies
      if (parsed.streamingUrls && Array.isArray(parsed.streamingUrls)) {
        setStreamingUrls(parsed.streamingUrls.length > 0 ? parsed.streamingUrls : [])
      }

      // Update seasons for TV shows
      if (parsed.seasons && Array.isArray(parsed.seasons)) {
        setSeasons(parsed.seasons)
      }
    } catch (error) {
      setJsonError('Invalid JSON: ' + (error as Error).message)
    }
  }

  const fetchGenres = async () => {
    try {
      const response = await fetch("/api/back-office/genres")
      if (response.ok) {
        const data = await response.json()
        setGenres(data)
      }
    } catch (error) {
      console.error("Failed to fetch genres:", error)
    }
  }

  const fetchMovie = async () => {
    try {
      const response = await fetch(`/api/back-office/movies/${movieId}`)
      if (response.ok) {
        const movie: Movie = await response.json()

        setFormData({
          title: movie.title,
          overview: movie.overview,
          year: movie.year,
          durationMin: movie.durationMin,
          rating: movie.rating,
          type: movie.type,
          posterUrl: movie.posterUrl || "",
          backdropUrl: movie.backdropUrl || "",
          trailerUrl: movie.trailerUrl || "",
          genreIds: movie.genres.map(g => g.id)
        })

        setStreamingUrls(movie.streamingUrls?.map(url => ({
          id: url.id,
          url: url.url,
          quality: url.quality || "1080p",
          platform: url.platform || "Xflix",
          isActive: url.isActive
        })) || [])

        // Load seasons and episodes for TV shows
        if (movie.type === 'TV_SHOW' && movie.seasons) {
          setSeasons(movie.seasons.map(season => ({
            id: season.id,
            seasonNumber: season.seasonNumber,
            title: season.title || `Season ${season.seasonNumber}`,
            overview: season.overview || "",
            posterUrl: season.posterUrl || "",
            episodes: season.episodes?.map(episode => ({
              id: episode.id,
              episodeNumber: episode.episodeNumber,
              title: episode.title,
              overview: episode.overview || "",
              durationMin: episode.durationMin,
              rating: episode.rating,
              stillUrl: episode.stillUrl || "",
              streamingUrls: episode.streamingUrls?.map(url => ({
                id: url.id,
                url: url.url,
                quality: url.quality || "1080p",
                platform: url.platform || "Xflix",
                isActive: url.isActive
              })) || []
            })) || []
          })))
        }
      } else {
        alert("Movie not found")
        router.push("/back-office/movies")
      }
    } catch (error) {
      console.error("Failed to fetch movie:", error)
    } finally {
      setPageLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (formData.genreIds.length === 0) {
      alert('Please select at least one genre')
      return
    }

    if (formData.type === 'MOVIE' && streamingUrls.filter(url => url.url.trim() !== "").length === 0) {
      alert('Please add at least one streaming URL for movies')
      return
    }

    setLoading(true)

    try {
      const payload: any = {
        ...formData,
        streamingUrls: formData.type === 'MOVIE' ? streamingUrls.filter(url => url.url.trim() !== "") : []
      }

      if (formData.type === 'TV_SHOW') {
        payload.seasons = seasons.map(season => ({
          ...season,
          episodes: season.episodes.map(episode => ({
            ...episode,
            streamingUrls: episode.streamingUrls.filter(url => url.url.trim() !== "")
          }))
        }))
      }

      const response = await fetch(`/api/back-office/movies/${movieId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push("/back-office/movies")
      } else {
        const error = await response.json()
        alert(error.message || "Failed to update movie")
      }
    } catch (error) {
      console.error("Failed to update movie:", error)
      alert("Failed to update movie")
    } finally {
      setLoading(false)
    }
  }

  const addStreamingUrl = () => {
    setStreamingUrls([...streamingUrls, { url: "", quality: "1080p", platform: "Xflix", isActive: true }])
  }

  const removeStreamingUrl = (index: number) => {
    setStreamingUrls(streamingUrls.filter((_, i) => i !== index))
  }

  const updateStreamingUrl = (index: number, field: keyof StreamingUrlForm, value: string | boolean) => {
    const updated = [...streamingUrls]
    updated[index] = { ...updated[index], [field]: value }
    setStreamingUrls(updated)
  }

  // Season management functions
  const addSeason = () => {
    const newSeasonNumber = seasons.length > 0 ? Math.max(...seasons.map(s => s.seasonNumber)) + 1 : 1
    setSeasons([...seasons, {
      seasonNumber: newSeasonNumber,
      title: `Season ${newSeasonNumber}`,
      overview: "",
      posterUrl: "",
      episodes: []
    }])
  }

  const removeSeason = (seasonIndex: number) => {
    setSeasons(seasons.filter((_, i) => i !== seasonIndex))
  }

  const updateSeason = (seasonIndex: number, field: keyof SeasonForm, value: any) => {
    const updated = [...seasons]
    updated[seasonIndex] = { ...updated[seasonIndex], [field]: value }
    setSeasons(updated)
  }

  const toggleSeasonExpanded = (seasonIndex: number) => {
    setExpandedSeasons(prev => {
      const newSet = new Set(prev)
      if (newSet.has(seasonIndex)) {
        newSet.delete(seasonIndex)
      } else {
        newSet.add(seasonIndex)
      }
      return newSet
    })
  }

  // Episode management functions
  const addEpisode = (seasonIndex: number) => {
    const updated = [...seasons]
    const season = updated[seasonIndex]
    const newEpisodeNumber = season.episodes.length > 0 ? Math.max(...season.episodes.map(e => e.episodeNumber)) + 1 : 1
    season.episodes.push({
      episodeNumber: newEpisodeNumber,
      title: `Episode ${newEpisodeNumber}`,
      overview: "",
      durationMin: 45,
      rating: 0,
      stillUrl: "",
      streamingUrls: []
    })
    setSeasons(updated)
  }

  const removeEpisode = (seasonIndex: number, episodeIndex: number) => {
    const updated = [...seasons]
    updated[seasonIndex].episodes = updated[seasonIndex].episodes.filter((_, i) => i !== episodeIndex)
    setSeasons(updated)
  }

  const updateEpisode = (seasonIndex: number, episodeIndex: number, field: keyof EpisodeForm, value: any) => {
    const updated = [...seasons]
    updated[seasonIndex].episodes[episodeIndex] = {
      ...updated[seasonIndex].episodes[episodeIndex],
      [field]: value
    }
    setSeasons(updated)
  }

  // Episode streaming URL management
  const addEpisodeStreamingUrl = (seasonIndex: number, episodeIndex: number) => {
    const updated = [...seasons]
    updated[seasonIndex].episodes[episodeIndex].streamingUrls.push({
      url: "",
      quality: "1080p",
      platform: "Xflix",
      isActive: true
    })
    setSeasons(updated)
  }

  const removeEpisodeStreamingUrl = (seasonIndex: number, episodeIndex: number, urlIndex: number) => {
    const updated = [...seasons]
    updated[seasonIndex].episodes[episodeIndex].streamingUrls =
      updated[seasonIndex].episodes[episodeIndex].streamingUrls.filter((_, i) => i !== urlIndex)
    setSeasons(updated)
  }

  const updateEpisodeStreamingUrl = (
    seasonIndex: number,
    episodeIndex: number,
    urlIndex: number,
    field: keyof EpisodeStreamingUrlForm,
    value: string | boolean
  ) => {
    const updated = [...seasons]
    updated[seasonIndex].episodes[episodeIndex].streamingUrls[urlIndex] = {
      ...updated[seasonIndex].episodes[episodeIndex].streamingUrls[urlIndex],
      [field]: value
    }
    setSeasons(updated)
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/back-office/auth/logout", {
        method: "POST"
      })
      window.location.href = "/back-office"
    } catch (error) {
      console.error("Logout failed:", error)
      window.location.href = "/back-office"
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-xflix-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-xflix-dark">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/back-office/dashboard" className="flex items-center">
                <span className="bg-xflix-red text-white font-black text-xl w-8 h-8 rounded flex items-center justify-center mr-2">
                  X
                </span>
                <span className="text-white font-bold text-xl">FLIX</span>
                <span className="ml-4 text-gray-400">Back Office</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/back-office/dashboard"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/back-office/movies"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Movies
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/back-office/movies"
            className="mr-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit {formData.type === 'TV_SHOW' ? 'TV Show' : 'Movie'}</h1>
            <p className="text-gray-400">Update {formData.type === 'TV_SHOW' ? 'TV show' : 'movie'} information</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-black/40 p-1 rounded-xl border border-gray-700/50 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'form'
                ? 'bg-xflix-red text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Form View
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'json'
                ? 'bg-xflix-red text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            JSON Editor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {activeTab === 'form' ? (
            <>
          {/* Basic Information */}
          <div className="bg-black/40 backdrop-blur-md rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as "MOVIE" | "TV_SHOW" })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                >
                  <option value="MOVIE">Movie</option>
                  <option value="TV_SHOW">TV Show</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.durationMin}
                  onChange={(e) => setFormData({ ...formData, durationMin: parseInt(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rating (0-10) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Overview *
              </label>
              <textarea
                required
                rows={4}
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-black/40 backdrop-blur-md rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Images</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Poster URL
                </label>
                <input
                  type="url"
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Backdrop URL
                </label>
                <input
                  type="url"
                  value={formData.backdropUrl}
                  onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Trailer URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.trailerUrl}
                  onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                  placeholder="YouTube embed or streaming URL"
                />
              </div>
            </div>
          </div>

          {/* Genres */}
          <div className="bg-black/40 backdrop-blur-md rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Genres</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {genres.map((genre) => (
                <label key={genre.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.genreIds.includes(genre.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, genreIds: [...formData.genreIds, genre.id] })
                      } else {
                        setFormData({ ...formData, genreIds: formData.genreIds.filter(id => id !== genre.id) })
                      }
                    }}
                    className="rounded border-gray-600 text-xflix-red focus:ring-xflix-red"
                  />
                  <span className="text-gray-300">{genre.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Streaming URLs - Only for Movies */}
          {formData.type === 'MOVIE' && (
            <div className="bg-black/40 backdrop-blur-md rounded-lg border border-gray-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Streaming URLs</h2>
                <button
                  type="button"
                  onClick={addStreamingUrl}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add URL</span>
                </button>
              </div>

            <div className="space-y-4">
              {streamingUrls.map((streamingUrl, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="url"
                      placeholder="https://example.com/stream/movie"
                      value={streamingUrl.url}
                      onChange={(e) => updateStreamingUrl(index, "url", e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                    />
                  </div>

                  <select
                    value={streamingUrl.quality}
                    onChange={(e) => updateStreamingUrl(index, "quality", e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                  >
                    <option value="720p">720p</option>
                    <option value="1080p">1080p</option>
                    <option value="4K">4K</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Platform"
                    value={streamingUrl.platform}
                    onChange={(e) => updateStreamingUrl(index, "platform", e.target.value)}
                    className="w-32 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                  />

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={streamingUrl.isActive}
                      onChange={(e) => updateStreamingUrl(index, "isActive", e.target.checked)}
                      className="rounded border-gray-600 text-xflix-red focus:ring-xflix-red"
                    />
                    <span className="text-gray-300 text-sm">Active</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => removeStreamingUrl(index)}
                    className="p-2 text-red-400 hover:bg-red-400/20 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {streamingUrls.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No streaming URLs. Click "Add URL" to add one.
                </div>
              )}
            </div>
            </div>
          )}

          {/* Seasons & Episodes - Only for TV Shows */}
          {formData.type === 'TV_SHOW' && (
            <div className="bg-black/40 backdrop-blur-md rounded-lg border border-gray-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Seasons & Episodes</h2>
                <button
                  type="button"
                  onClick={addSeason}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Season</span>
                </button>
              </div>

              <div className="space-y-4">
                {seasons.map((season, seasonIndex) => (
                  <div key={seasonIndex} className="border border-gray-700 rounded-lg overflow-hidden">
                    {/* Season Header */}
                    <div className="bg-gray-800/50 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={() => toggleSeasonExpanded(seasonIndex)}
                          className="flex items-center space-x-2 text-white hover:text-gray-300"
                        >
                          {expandedSeasons.has(seasonIndex) ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                          <span className="font-semibold">Season {season.seasonNumber}</span>
                          <span className="text-sm text-gray-400">({season.episodes.length} episodes)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSeason(seasonIndex)}
                          className="p-2 text-red-400 hover:bg-red-400/20 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Season Number
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={season.seasonNumber}
                            onChange={(e) => updateSeason(seasonIndex, 'seasonNumber', parseInt(e.target.value))}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Season Title
                          </label>
                          <input
                            type="text"
                            value={season.title}
                            onChange={(e) => updateSeason(seasonIndex, 'title', e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Overview
                          </label>
                          <textarea
                            rows={2}
                            value={season.overview}
                            onChange={(e) => updateSeason(seasonIndex, 'overview', e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Poster URL
                          </label>
                          <input
                            type="url"
                            value={season.posterUrl}
                            onChange={(e) => updateSeason(seasonIndex, 'posterUrl', e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Episodes Section */}
                    {expandedSeasons.has(seasonIndex) && (
                      <div className="p-4 bg-gray-900/30">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-white font-medium">Episodes</h4>
                          <button
                            type="button"
                            onClick={() => addEpisode(seasonIndex)}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Episode</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {season.episodes.map((episode, episodeIndex) => (
                            <div key={episodeIndex} className="border border-gray-700 rounded-lg p-4 bg-gray-800/30">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-white font-medium">Episode {episode.episodeNumber}</span>
                                <button
                                  type="button"
                                  onClick={() => removeEpisode(seasonIndex, episodeIndex)}
                                  className="p-1.5 text-red-400 hover:bg-red-400/20 rounded-md transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-400 mb-1">
                                    Episode Number
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={episode.episodeNumber}
                                    onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'episodeNumber', parseInt(e.target.value))}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-400 mb-1">
                                    Title
                                  </label>
                                  <input
                                    type="text"
                                    value={episode.title}
                                    onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'title', e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-400 mb-1">
                                    Duration (min)
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={episode.durationMin}
                                    onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'durationMin', parseInt(e.target.value))}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-400 mb-1">
                                    Rating (0-10)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={episode.rating}
                                    onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'rating', parseFloat(e.target.value))}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                                  />
                                </div>

                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-400 mb-1">
                                    Overview
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={episode.overview}
                                    onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'overview', e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                                  />
                                </div>

                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-400 mb-1">
                                    Still Image URL
                                  </label>
                                  <input
                                    type="url"
                                    value={episode.stillUrl}
                                    onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'stillUrl', e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-xflix-red"
                                  />
                                </div>
                              </div>

                              {/* Episode Streaming URLs */}
                              <div className="mt-3">
                                <div className="flex justify-between items-center mb-2">
                                  <label className="block text-xs font-medium text-gray-400">
                                    Streaming URLs
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => addEpisodeStreamingUrl(seasonIndex, episodeIndex)}
                                    className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Add URL</span>
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  {episode.streamingUrls.map((url, urlIndex) => (
                                    <div key={urlIndex} className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded">
                                      <input
                                        type="url"
                                        placeholder="https://example.com/stream/episode"
                                        value={url.url}
                                        onChange={(e) => updateEpisodeStreamingUrl(seasonIndex, episodeIndex, urlIndex, 'url', e.target.value)}
                                        className="flex-1 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-xflix-red"
                                      />

                                      <select
                                        value={url.quality}
                                        onChange={(e) => updateEpisodeStreamingUrl(seasonIndex, episodeIndex, urlIndex, 'quality', e.target.value)}
                                        className="bg-gray-600 border border-gray-500 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-xflix-red"
                                      >
                                        <option value="720p">720p</option>
                                        <option value="1080p">1080p</option>
                                        <option value="4K">4K</option>
                                      </select>

                                      <input
                                        type="text"
                                        placeholder="Platform"
                                        value={url.platform}
                                        onChange={(e) => updateEpisodeStreamingUrl(seasonIndex, episodeIndex, urlIndex, 'platform', e.target.value)}
                                        className="w-20 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-xflix-red"
                                      />

                                      <label className="flex items-center space-x-1">
                                        <input
                                          type="checkbox"
                                          checked={url.isActive}
                                          onChange={(e) => updateEpisodeStreamingUrl(seasonIndex, episodeIndex, urlIndex, 'isActive', e.target.checked)}
                                          className="rounded border-gray-500 text-xflix-red focus:ring-xflix-red"
                                        />
                                        <span className="text-gray-400 text-xs">Active</span>
                                      </label>

                                      <button
                                        type="button"
                                        onClick={() => removeEpisodeStreamingUrl(seasonIndex, episodeIndex, urlIndex)}
                                        className="p-1 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}

                                  {episode.streamingUrls.length === 0 && (
                                    <div className="text-center py-2 text-gray-500 text-xs">
                                      No streaming URLs
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}

                          {season.episodes.length === 0 && (
                            <div className="text-center py-4 text-gray-400 text-sm">
                              No episodes. Click "Add Episode" to add one.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {seasons.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No seasons. Click "Add Season" to add one.
                  </div>
                )}
              </div>
            </div>
          )}
            </>
          ) : (
            <div className="bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-8 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
                  <ArrowLeft className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-1">JSON Editor</h2>
                  <p className="text-gray-400">Edit movie data directly as JSON</p>
                </div>
              </div>

              {jsonError && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-300 text-sm font-medium">{jsonError}</p>
                </div>
              )}

              <textarea
                value={jsonData}
                onChange={(e) => handleJsonChange(e.target.value)}
                className="w-full h-[600px] bg-black/50 text-gray-100 border border-gray-600/50 rounded-lg p-4 font-mono text-sm focus:outline-none focus:border-xflix-red/50 focus:ring-2 focus:ring-xflix-red/20 resize-none"
                spellCheck={false}
                placeholder='{"title": "Movie Title", ...}'
              />

              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  <strong>Tip:</strong> Edit the JSON directly and it will sync with the form automatically. Make sure your JSON is valid before submitting.
                </p>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/back-office/movies"
              className="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-xflix-red hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : `Update ${formData.type === 'TV_SHOW' ? 'TV Show' : 'Movie'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}