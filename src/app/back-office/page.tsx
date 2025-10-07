"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/common/button"

export default function BackOfficeLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/back-office/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("admin-token", data.token)
        // Also set the token as a cookie for server-side middleware
        document.cookie = `admin-token=${data.token}; path=/; max-age=86400` // 24 hours
        router.push("/back-office/dashboard")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Invalid credentials")
      }
    } catch (error) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-xflix-dark flex items-center justify-center px-4">
      <div className="bg-black/80 backdrop-blur-md rounded-lg border border-gray-800 p-8 w-full" style={{maxWidth: '450px'}}>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <span className="navbar-logo-n mr-2">
              X
            </span>
            <span className="navbar-logo-text">FLIX</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-1">Back Office</h1>
          <p className="text-gray-400 text-sm">Sign in to manage Xflix</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-md p-2">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-xflix-red focus:border-transparent text-sm"
              placeholder="admin@xflix.xyz"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-xflix-red focus:border-transparent text-sm"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-xflix-red hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs">
            Demo: admin@xflix.xyz / admin123
          </p>
        </div>
      </div>
    </div>
  )
}