'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onReset={() => this.setState({ hasError: false })} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error?: Error
  onReset: () => void
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen bg-xflix-dark flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-white mb-2">Oops! Something went wrong</h1>
          <p className="text-gray-400 mb-6">
            We encountered an unexpected error. Don't worry, our team has been notified.
          </p>
        </div>

        {isDevelopment && error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-left">
            <h3 className="text-red-400 font-medium mb-2">Error Details:</h3>
            <p className="text-sm text-gray-300 font-mono break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={onReset}
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

          <button
            onClick={() => window.location.reload()}
            className="w-full border-2 border-gray-600 hover:border-gray-500 bg-transparent hover:bg-gray-800/50 text-gray-300 hover:text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  )
}