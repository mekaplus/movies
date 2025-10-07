'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-xflix-dark flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="text-6xl mb-4">💥</div>
          <h1 className="text-3xl font-bold text-white mb-2">Something went wrong!</h1>
          <p className="text-gray-400 mb-6">
            An unexpected error occurred while loading this page.
          </p>
        </div>

        {isDevelopment && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-left">
            <h3 className="text-red-400 font-medium mb-2">Error Details:</h3>
            <p className="text-sm text-gray-300 font-mono break-words">
              {error.message || 'Unknown error occurred'}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
          >
            Try Again
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
          >
            Go to Home
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          If this problem persists, please contact support.
        </div>
      </div>
    </div>
  )
}