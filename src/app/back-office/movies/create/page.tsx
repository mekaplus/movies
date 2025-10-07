"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, LogOut, Film, Info, Play } from "@/components/common/icons"
import { Input, Select, Checkbox, Textarea, Button } from "@/components/common/form"
import { Genre } from "@/lib/types"

interface StreamingUrlForm {
  url: string
  quality: string
  platform: string
  isActive: boolean
}

interface EpisodeForm {
  episodeNumber: number
  title: string
  overview: string
  durationMin: number
  rating: number
  stillUrl: string
  streamingUrls: StreamingUrlForm[]
}

interface SeasonForm {
  seasonNumber: number
  title: string
  overview: string
  posterUrl: string
  episodes: EpisodeForm[]
}

export default function CreateMovie() {
  const [loading, setLoading] = useState(false)
  const [genres, setGenres] = useState<Genre[]>([])
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
  const [streamingUrls, setStreamingUrls] = useState<StreamingUrlForm[]>([
    { url: "", quality: "1080p", platform: "Xflix", isActive: true }
  ])
  const [seasons, setSeasons] = useState<SeasonForm[]>([])
  const [jsonData, setJsonData] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    // Authentication is handled by middleware
    fetchGenres()
  }, [])

  // Sync form data to JSON whenever it changes
  useEffect(() => {
    const payload = {
      ...formData,
      streamingUrls: formData.type === 'MOVIE' ? streamingUrls.filter(url => url.url.trim() !== "") : [],
      ...(formData.type === 'TV_SHOW' && {
        seasons: seasons.map(season => ({
          ...season,
          episodes: season.episodes.map(episode => ({
            ...episode,
            streamingUrls: episode.streamingUrls.filter(url => url.url.trim() !== "")
          }))
        }))
      })
    }
    setJsonData(JSON.stringify(payload, null, 2))
  }, [formData, streamingUrls, seasons])

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
        setStreamingUrls(parsed.streamingUrls.length > 0 ? parsed.streamingUrls : [
          { url: "", quality: "1080p", platform: "Xflix", isActive: true }
        ])
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

      const response = await fetch("/api/back-office/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push("/back-office/movies")
      } else {
        const error = await response.json()
        alert(error.message || "Failed to create " + (formData.type === 'MOVIE' ? 'movie' : 'TV show'))
      }
    } catch (error) {
      console.error("Failed to create:", error)
      alert("Failed to create " + (formData.type === 'MOVIE' ? 'movie' : 'TV show'))
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

  const handleLogout = () => {
    localStorage.removeItem("admin-token")
    // Clear the cookie as well
    document.cookie = "admin-token=; path=/; max-age=0"
    router.push("/back-office")
  }

  // Season management functions
  const addSeason = () => {
    const newSeason: SeasonForm = {
      seasonNumber: seasons.length + 1,
      title: `Season ${seasons.length + 1}`,
      overview: "",
      posterUrl: "",
      episodes: []
    }
    setSeasons([...seasons, newSeason])
  }

  const removeSeason = (seasonIndex: number) => {
    setSeasons(seasons.filter((_, i) => i !== seasonIndex))
  }

  const updateSeason = (seasonIndex: number, field: keyof Omit<SeasonForm, 'episodes'>, value: string | number) => {
    const updated = [...seasons]
    updated[seasonIndex] = { ...updated[seasonIndex], [field]: value }
    setSeasons(updated)
  }

  // Episode management functions
  const addEpisode = (seasonIndex: number) => {
    const newEpisode: EpisodeForm = {
      episodeNumber: seasons[seasonIndex].episodes.length + 1,
      title: `Episode ${seasons[seasonIndex].episodes.length + 1}`,
      overview: "",
      durationMin: formData.durationMin || 45,
      rating: formData.rating || 0,
      stillUrl: "",
      streamingUrls: [{ url: "", quality: "1080p", platform: "Xflix", isActive: true }]
    }
    const updated = [...seasons]
    updated[seasonIndex].episodes.push(newEpisode)
    setSeasons(updated)
  }

  const removeEpisode = (seasonIndex: number, episodeIndex: number) => {
    const updated = [...seasons]
    updated[seasonIndex].episodes = updated[seasonIndex].episodes.filter((_, i) => i !== episodeIndex)
    setSeasons(updated)
  }

  const updateEpisode = (seasonIndex: number, episodeIndex: number, field: keyof Omit<EpisodeForm, 'streamingUrls'>, value: string | number) => {
    const updated = [...seasons]
    updated[seasonIndex].episodes[episodeIndex] = {
      ...updated[seasonIndex].episodes[episodeIndex],
      [field]: value
    }
    setSeasons(updated)
  }

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

  const updateEpisodeStreamingUrl = (seasonIndex: number, episodeIndex: number, urlIndex: number, field: keyof StreamingUrlForm, value: string | boolean) => {
    const updated = [...seasons]
    updated[seasonIndex].episodes[episodeIndex].streamingUrls[urlIndex] = {
      ...updated[seasonIndex].episodes[episodeIndex].streamingUrls[urlIndex],
      [field]: value
    }
    setSeasons(updated)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-xflix-dark via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-xl border-b border-gray-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href="/back-office/dashboard" className="flex items-center">
                <span className="navbar-logo-n mr-3">
                  X
                </span>
                <span className="navbar-logo-text">FLIX</span>
                <div className="ml-6 px-3 py-1 bg-xflix-red/20 border border-xflix-red/30 rounded-full">
                  <span className="text-xflix-red text-sm font-medium">Back Office</span>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              <Link
                href="/back-office/dashboard"
                className="px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="/back-office/movies"
                className="px-3 py-2 text-white bg-gray-800/50 border border-gray-600/50 rounded-lg"
              >
                Movies
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-white bg-gray-800/50 hover:bg-gray-700/60 border border-gray-600/50 hover:border-gray-500/50 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center mb-10">
          <Link
            href="/back-office/movies"
            className="mr-6 p-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200 border border-gray-700/50 hover:border-gray-600/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Create {formData.type === 'MOVIE' ? 'Movie' : 'TV Show'}
            </h1>
            <p className="text-gray-400 text-lg">Add a new {formData.type === 'MOVIE' ? 'movie' : 'TV show'} to your catalog</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Form Progress</p>
            <p className="text-white font-medium">Step 1 of 1</p>
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

        <form onSubmit={handleSubmit} className="space-y-10">
          {activeTab === 'form' ? (
            <>
          {/* Basic Information */}
          <div className="bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-8 shadow-xl">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4">
                <Film className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white mb-1">Basic Information</h2>
                <p className="text-gray-400">Essential movie details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <Select
                label="Type"
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "MOVIE" | "TV_SHOW" })}
              >
                <option value="MOVIE">Movie</option>
                <option value="TV_SHOW">TV Show</option>
              </Select>

              <Input
                label="Year"
                type="number"
                required
                min="1900"
                max={new Date().getFullYear() + 5}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              />

              <Input
                label="Duration (minutes)"
                type="number"
                required
                min="1"
                value={formData.durationMin}
                onChange={(e) => setFormData({ ...formData, durationMin: parseInt(e.target.value) })}
              />

              <Input
                label="Rating (0-10)"
                type="number"
                required
                min="0"
                max="10"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
              />
            </div>

            <div className="mt-6">
              <Textarea
                label="Overview"
                required
                rows={4}
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-8 shadow-xl">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4">
                <Info className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white mb-1">Images</h2>
                <p className="text-gray-400">Poster and backdrop images</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Poster URL"
                type="url"
                value={formData.posterUrl}
                onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
              />

              <Input
                label="Backdrop URL"
                type="url"
                value={formData.backdropUrl}
                onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
              />

              <Input
                label="Trailer URL (optional)"
                type="url"
                value={formData.trailerUrl}
                onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                placeholder="YouTube embed or streaming URL"
              />
            </div>
          </div>

          {/* Genres */}
          <div className="bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-8 shadow-xl">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
                <Film className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white mb-1">Genres</h2>
                <p className="text-gray-400">Select movie categories</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {genres.map((genre) => (
                <Checkbox
                  key={genre.id}
                  label={genre.name}
                  checked={formData.genreIds.includes(genre.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({ ...formData, genreIds: [...formData.genreIds, genre.id] })
                    } else {
                      setFormData({ ...formData, genreIds: formData.genreIds.filter(id => id !== genre.id) })
                    }
                  }}
                />
              ))}
            </div>
          </div>

          {/* Streaming URLs - Only for Movies */}
          {formData.type === 'MOVIE' && (
          <div className="bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mr-4">
                  <Play className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-1">Streaming URLs</h2>
                  <p className="text-gray-400">Configure playback sources</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addStreamingUrl}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add URL</span>
              </button>
            </div>

            <div className="space-y-8">
              {streamingUrls.map((streamingUrl, index) => (
                <div key={index} className="group bg-gradient-to-r from-gray-800/40 to-gray-700/30 rounded-xl border border-gray-600/30 hover:border-gray-500/50 p-8 transition-all duration-200">
                  <div className="flex items-end space-x-6">
                    <div className="flex-1">
                      <Input
                        label="Stream URL"
                        type="url"
                        placeholder="https://example.com/stream/movie"
                        value={streamingUrl.url}
                        onChange={(e) => updateStreamingUrl(index, "url", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Select
                        label="Quality"
                        value={streamingUrl.quality}
                        onChange={(e) => updateStreamingUrl(index, "quality", e.target.value)}
                      >
                        <option value="720p">720p HD</option>
                        <option value="1080p">1080p FHD</option>
                        <option value="4K">4K UHD</option>
                      </Select>
                    </div>

                    <div>
                      <Input
                        label="Platform"
                        type="text"
                        placeholder="Xflix"
                        value={streamingUrl.platform}
                        onChange={(e) => updateStreamingUrl(index, "platform", e.target.value)}
                        className="w-40"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-red-400 mb-3">
                        Status
                      </label>
                      <Checkbox
                        label="Active"
                        checked={streamingUrl.isActive}
                        onChange={(e) => updateStreamingUrl(index, "isActive", e.target.checked)}
                      />
                    </div>

                    {streamingUrls.length > 1 && (
                      <div>
                        <label className="block text-sm font-semibold text-red-400 mb-3 opacity-0">
                          Remove
                        </label>
                        <button
                          type="button"
                          onClick={() => removeStreamingUrl(index)}
                          className="p-4 text-red-400 hover:text-red-300 hover:bg-red-400/20 rounded-xl transition-all duration-200 border border-red-400/30 hover:border-red-400/50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Seasons & Episodes - Only for TV Shows */}
          {formData.type === 'TV_SHOW' && (
          <div className="bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4">
                  <Film className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-1">Seasons & Episodes</h2>
                  <p className="text-gray-400">Organize your TV show content</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addSeason}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add Season</span>
              </button>
            </div>

            <div className="space-y-8">
              {seasons.map((season, seasonIndex) => (
                <div key={seasonIndex} className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 rounded-xl border border-purple-500/30 p-6">
                  {/* Season Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-600/50">
                    <h3 className="text-xl font-bold text-purple-300">Season {season.seasonNumber}</h3>
                    <button
                      type="button"
                      onClick={() => removeSeason(seasonIndex)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/20 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Season Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Input
                      label="Season Title"
                      type="text"
                      value={season.title}
                      onChange={(e) => updateSeason(seasonIndex, 'title', e.target.value)}
                    />
                    <Input
                      label="Poster URL"
                      type="url"
                      value={season.posterUrl}
                      onChange={(e) => updateSeason(seasonIndex, 'posterUrl', e.target.value)}
                    />
                  </div>

                  <div className="mb-6">
                    <Textarea
                      label="Season Overview"
                      rows={2}
                      value={season.overview}
                      onChange={(e) => updateSeason(seasonIndex, 'overview', e.target.value)}
                    />
                  </div>

                  {/* Episodes */}
                  <div className="bg-black/30 rounded-lg p-6 border border-gray-600/30">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">Episodes</h4>
                      <button
                        type="button"
                        onClick={() => addEpisode(seasonIndex)}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Episode</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {season.episodes.map((episode, episodeIndex) => (
                        <div key={episodeIndex} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-md font-semibold text-green-300">Episode {episode.episodeNumber}</h5>
                            <button
                              type="button"
                              onClick={() => removeEpisode(seasonIndex, episodeIndex)}
                              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/20 rounded transition-all duration-200"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <Input
                              label="Title"
                              type="text"
                              value={episode.title}
                              onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'title', e.target.value)}
                            />
                            <Input
                              label="Duration (min)"
                              type="number"
                              min="1"
                              value={episode.durationMin}
                              onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'durationMin', parseInt(e.target.value))}
                            />
                            <Input
                              label="Rating (0-10)"
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              value={episode.rating}
                              onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'rating', parseFloat(e.target.value))}
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-4 mb-4">
                            <Textarea
                              label="Overview"
                              rows={2}
                              value={episode.overview}
                              onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'overview', e.target.value)}
                            />
                            <Input
                              label="Still Image URL"
                              type="url"
                              value={episode.stillUrl}
                              onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'stillUrl', e.target.value)}
                            />
                          </div>

                          {/* Episode Streaming URLs */}
                          <div className="bg-black/40 rounded-lg p-4 border border-blue-500/20">
                            <div className="flex items-center justify-between mb-3">
                              <h6 className="text-sm font-semibold text-blue-300">Streaming URLs</h6>
                              <button
                                type="button"
                                onClick={() => addEpisodeStreamingUrl(seasonIndex, episodeIndex)}
                                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add</span>
                              </button>
                            </div>

                            <div className="space-y-3">
                              {episode.streamingUrls.map((streamUrl, urlIndex) => (
                                <div key={urlIndex} className="flex items-end gap-2">
                                  <div className="flex-1">
                                    <Input
                                      label="URL"
                                      type="url"
                                      placeholder="https://example.com/stream/episode"
                                      value={streamUrl.url}
                                      onChange={(e) => updateEpisodeStreamingUrl(seasonIndex, episodeIndex, urlIndex, 'url', e.target.value)}
                                    />
                                  </div>
                                  <div className="w-24">
                                    <Select
                                      label="Quality"
                                      value={streamUrl.quality}
                                      onChange={(e) => updateEpisodeStreamingUrl(seasonIndex, episodeIndex, urlIndex, 'quality', e.target.value)}
                                    >
                                      <option value="720p">720p</option>
                                      <option value="1080p">1080p</option>
                                      <option value="4K">4K</option>
                                    </Select>
                                  </div>
                                  {episode.streamingUrls.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeEpisodeStreamingUrl(seasonIndex, episodeIndex, urlIndex)}
                                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/20 rounded mb-1"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}

                      {season.episodes.length === 0 && (
                        <p className="text-center text-gray-400 py-4">No episodes yet. Click "Add Episode" to get started.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {seasons.length === 0 && (
                <p className="text-center text-gray-400 py-8">No seasons yet. Click "Add Season" to get started.</p>
              )}
            </div>
          </div>
          )}
            </>
          ) : (
            <div className="bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-8 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
                  <Film className="w-6 h-6 text-green-400" />
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
          <div className="bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Ready to Create?</h3>
                <p className="text-gray-400">Review your {formData.type === 'MOVIE' ? 'movie' : 'TV show'} details and create the entry</p>
              </div>
              <div className="flex space-x-6">
                <Link
                  href="/back-office/movies"
                  className="px-8 py-4 border border-gray-600/50 text-gray-300 rounded-xl hover:bg-gray-800/50 hover:border-gray-500/50 transition-all duration-200 font-semibold text-base"
                >
                  Cancel
                </Link>
                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  size="lg"
                >
                  {loading ? `Creating ${formData.type === 'MOVIE' ? 'Movie' : 'TV Show'}...` : `Create ${formData.type === 'MOVIE' ? 'Movie' : 'TV Show'}`}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}