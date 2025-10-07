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

export default function CreateMovie() {
  const [loading, setLoading] = useState(false)
  const [genres, setGenres] = useState<Genre[]>([])
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    year: new Date().getFullYear(),
    durationMin: 0,
    rating: 0,
    type: "MOVIE" as "MOVIE" | "TV_SHOW",
    posterUrl: "",
    backdropUrl: "",
    genreIds: [] as string[]
  })
  const [streamingUrls, setStreamingUrls] = useState<StreamingUrlForm[]>([
    { url: "", quality: "1080p", platform: "Xflix", isActive: true }
  ])
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("admin-token")
    if (!token) {
      router.push("/back-office")
      return
    }

    fetchGenres()
  }, [router])

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
      const response = await fetch("/api/back-office/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          streamingUrls: streamingUrls.filter(url => url.url.trim() !== "")
        }),
      })

      if (response.ok) {
        router.push("/back-office/movies")
      } else {
        const error = await response.json()
        alert(error.message || "Failed to create movie")
      }
    } catch (error) {
      console.error("Failed to create movie:", error)
      alert("Failed to create movie")
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
              Create Movie
            </h1>
            <p className="text-gray-400 text-lg">Add a new movie to your catalog</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Form Progress</p>
            <p className="text-white font-medium">Step 1 of 1</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
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

          {/* Streaming URLs */}
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

          {/* Submit */}
          <div className="bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Ready to Create?</h3>
                <p className="text-gray-400">Review your movie details and create the entry</p>
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
                  {loading ? "Creating Movie..." : "Create Movie"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}