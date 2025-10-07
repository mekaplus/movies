"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Play, Users, Film, TrendingUp, Plus, Settings, LogOut } from "@/components/common/icons"
import Link from "next/link"

interface DashboardStats {
  totalMovies: number
  totalUsers: number
  totalViews: number
  totalStreamingUrls: number
}

export default function BackOfficeDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMovies: 0,
    totalUsers: 0,
    totalViews: 0,
    totalStreamingUrls: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("admin-token")
    if (!token) {
      router.push("/back-office")
      return
    }

    fetchDashboardStats()
  }, [router])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/back-office/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin-token")
    // Clear the cookie as well
    document.cookie = "admin-token=; path=/; max-age=0"
    router.push("/back-office")
  }

  const statsCards = [
    {
      title: "Total Movies",
      value: stats.totalMovies,
      icon: Film,
      color: "bg-blue-500/20 text-blue-400"
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-green-500/20 text-green-400"
    },
    {
      title: "Total Views",
      value: stats.totalViews,
      icon: Play,
      color: "bg-purple-500/20 text-purple-400"
    },
    {
      title: "Streaming URLs",
      value: stats.totalStreamingUrls,
      icon: TrendingUp,
      color: "bg-yellow-500/20 text-yellow-400"
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-xflix-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-xflix-dark via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-xl border-b border-gray-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <span className="navbar-logo-n mr-3">
                X
              </span>
              <span className="navbar-logo-text">FLIX</span>
              <div className="ml-6 px-3 py-1 bg-xflix-red/20 border border-xflix-red/30 rounded-full">
                <span className="text-xflix-red text-sm font-medium">Back Office</span>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-400">Welcome back</p>
                <p className="text-white font-medium">Administrator</p>
              </div>
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
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-400 text-lg">Welcome back to Xflix Back Office</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="text-white font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsCards.map((card, index) => (
            <div
              key={card.title}
              className="group bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105 shadow-xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">{card.title}</p>
                  <p className="text-3xl font-bold text-white mt-2 group-hover:text-white transition-colors">
                    {card.value.toLocaleString()}
                  </p>
                  <div className="mt-2 flex items-center text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+{Math.floor(Math.random() * 20 + 5)}%</span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-xl ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <card.icon className="w-7 h-7" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Movies Management */}
          <div className="bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4">
                <Film className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white mb-1">Movies Management</h2>
                <p className="text-gray-400">Manage your movie catalog</p>
              </div>
            </div>
            <div className="space-y-4">
              <Link
                href="/back-office/movies"
                className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-800/30 to-gray-700/20 rounded-xl hover:from-gray-700/40 hover:to-gray-600/30 transition-all duration-300 border border-gray-700/30 hover:border-gray-600/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Film className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-white font-medium">View All Movies</span>
                    <p className="text-gray-400 text-sm">{stats.totalMovies} movies in catalog</p>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                  →
                </div>
              </Link>
              <Link
                href="/back-office/movies/create"
                className="group flex items-center justify-between p-4 bg-gradient-to-r from-green-900/20 to-emerald-800/10 rounded-xl hover:from-green-800/30 hover:to-emerald-700/20 transition-all duration-300 border border-green-700/30 hover:border-green-600/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <Plus className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <span className="text-white font-medium">Add New Movie</span>
                    <p className="text-gray-400 text-sm">Create a new movie entry</p>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                  →
                </div>
              </Link>
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white mb-1">Analytics Overview</h2>
                <p className="text-gray-400">Platform insights</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-900/20 to-violet-800/10 rounded-xl border border-purple-700/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Film className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-gray-300 font-medium">Most Popular Genre</span>
                  </div>
                  <span className="text-white font-semibold px-3 py-1 bg-purple-500/20 rounded-full text-sm">Action</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-yellow-900/20 to-orange-800/10 rounded-xl border border-yellow-700/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-yellow-400" />
                    </div>
                    <span className="text-gray-300 font-medium">Avg. Rating</span>
                  </div>
                  <span className="text-white font-semibold px-3 py-1 bg-yellow-500/20 rounded-full text-sm">8.2/10</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-900/20 to-cyan-800/10 rounded-xl border border-blue-700/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Play className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-gray-300 font-medium">Total Runtime</span>
                  </div>
                  <span className="text-white font-semibold px-3 py-1 bg-blue-500/20 rounded-full text-sm">2,450 hrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}