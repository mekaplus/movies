"use client"

import { useState } from "react"

export default function CookiePreferences() {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    advertising: true,
    functional: true,
  })

  const handleToggle = (category: keyof typeof preferences) => {
    if (category === 'essential') return // Essential cookies cannot be disabled

    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const handleSavePreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences))
    alert('Cookie preferences saved successfully!')
  }

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      advertising: true,
      functional: true,
    }
    setPreferences(allAccepted)
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted))
    alert('All cookies accepted!')
  }

  const handleRejectAll = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      advertising: false,
      functional: false,
    }
    setPreferences(onlyEssential)
    localStorage.setItem('cookiePreferences', JSON.stringify(onlyEssential))
    alert('Only essential cookies will be used.')
  }

  return (
    <div className="min-h-screen bg-xflix-dark text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Cookie Preferences</h1>

        <div className="space-y-6 text-gray-300">
          <p className="text-sm text-gray-400">Last Updated: January 2025</p>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">About Cookies</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience and allow certain features to work properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Cookie Categories</h2>

            {/* Essential Cookies */}
            <div className="bg-gray-800/50 rounded-lg p-6 mb-4 border border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">Essential Cookies</h3>
                  <p className="text-gray-400 mb-2">
                    These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas. The website cannot function properly without these cookies.
                  </p>
                  <p className="text-sm text-gray-500">Always Active</p>
                </div>
                <div className="ml-4">
                  <div className="w-12 h-6 bg-xflix-red rounded-full flex items-center px-1">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Examples:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-500 ml-4">
                  <li>Session cookies</li>
                  <li>Security cookies</li>
                  <li>Load balancing cookies</li>
                </ul>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="bg-gray-800/50 rounded-lg p-6 mb-4 border border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">Analytics Cookies</h3>
                  <p className="text-gray-400 mb-2">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our service.
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => handleToggle('analytics')}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      preferences.analytics ? 'bg-xflix-red' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      preferences.analytics ? 'ml-auto' : ''
                    }`}></div>
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Examples:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-500 ml-4">
                  <li>Google Analytics (_ga, _gid, _gat)</li>
                  <li>Page view tracking</li>
                  <li>User behavior analysis</li>
                  <li>Content interaction tracking</li>
                  <li>Search query analysis</li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">
                  We use Google Analytics to collect anonymous data about how users interact with our website, including which movies and TV shows are most popular, search patterns, and navigation behavior. This helps us improve content recommendations and user experience.
                </p>
              </div>
            </div>

            {/* Advertising Cookies */}
            <div className="bg-gray-800/50 rounded-lg p-6 mb-4 border border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">Advertising Cookies</h3>
                  <p className="text-gray-400 mb-2">
                    These cookies are used to deliver advertisements that are relevant to you. They also limit the number of times you see an ad and help measure the effectiveness of advertising campaigns.
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => handleToggle('advertising')}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      preferences.advertising ? 'bg-xflix-red' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      preferences.advertising ? 'ml-auto' : ''
                    }`}></div>
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Examples:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-500 ml-4">
                  <li>Google AdSense</li>
                  <li>Ad targeting cookies</li>
                  <li>Conversion tracking</li>
                  <li>Retargeting pixels</li>
                </ul>
              </div>
            </div>

            {/* Functional Cookies */}
            <div className="bg-gray-800/50 rounded-lg p-6 mb-4 border border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">Functional Cookies</h3>
                  <p className="text-gray-400 mb-2">
                    These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => handleToggle('functional')}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      preferences.functional ? 'bg-xflix-red' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      preferences.functional ? 'ml-auto' : ''
                    }`}></div>
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Examples:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-500 ml-4">
                  <li>Language preferences</li>
                  <li>Volume settings</li>
                  <li>Playback quality preferences</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Cookies</h2>
            <p className="mb-3">
              We use third-party services that may set cookies on your device. These include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Google Analytics - for website analytics</li>
              <li>Google AdSense - for advertising</li>
              <li>Video streaming providers - for content delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Managing Cookies</h2>
            <p className="mb-3">
              You can control cookies through:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Using the preference controls on this page</li>
              <li>Configuring your browser settings to block or delete cookies</li>
              <li>Using browser extensions for cookie management</li>
            </ul>
            <p className="mt-3 text-sm text-gray-400">
              Note: Blocking certain cookies may affect the functionality of our website and your user experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Cookie Lifespan</h2>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-white">Session Cookies</h4>
                <p className="text-sm text-gray-400">
                  Temporary cookies that are deleted when you close your browser.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white">Persistent Cookies</h4>
                <p className="text-sm text-gray-400">
                  Cookies that remain on your device for a set period or until manually deleted. Typically last from a few days to several years.
                </p>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAcceptAll}
                className="flex-1 bg-xflix-red hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Accept All Cookies
              </button>
              <button
                onClick={handleRejectAll}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Reject All (Except Essential)
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold border border-gray-600 transition-colors"
              >
                Save My Preferences
              </button>
            </div>
          </section>

          <section className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
            <p className="text-sm text-blue-300">
              <strong>Note:</strong> This website is ad-supported. Disabling advertising cookies may result in seeing less relevant ads, but ads will still be displayed to support our free service.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
