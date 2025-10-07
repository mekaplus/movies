"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, LogOut } from "@/components/common/icons"
import { Genre, Movie, StreamingUrl } from "@/lib/types"

interface StreamingUrlForm {
  id?: string
  url: string
  quality: string
  platform: string
  isActive: boolean
}

export default function EditMovie({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
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
  const [streamingUrls, setStreamingUrls] = useState<StreamingUrlForm[]>([])
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("admin-token")
    if (!token) {
      router.push("/back-office")
      return
    }

    fetchGenres()
    fetchMovie()
  }, [router, params.id])

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
      const response = await fetch(`/api/back-office/movies/${params.id}`)
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
          genreIds: movie.genres.map(g => g.id)
        })

        setStreamingUrls(movie.streamingUrls?.map(url => ({
          id: url.id,
          url: url.url,
          quality: url.quality || "1080p",
          platform: url.platform || "Xflix",
          isActive: url.isActive
        })) || [])
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
    setLoading(true)

    try {
      const response = await fetch(`/api/back-office/movies/${params.id}`, {
        method: "PUT",
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

  const handleLogout = () => {
    localStorage.removeItem("admin-token")
    // Clear the cookie as well
    document.cookie = "admin-token=; path=/; max-age=0"
    router.push("/back-office")
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/back-office/movies"
            className="mr-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Movie</h1>
            <p className="text-gray-400">Update movie information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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

          {/* Streaming URLs */}
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
              {loading ? "Updating..." : "Update Movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}