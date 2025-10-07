export default function CorporateInformation() {
  return (
    <div className="min-h-screen bg-xflix-dark text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Corporate Information</h1>

        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">About XFLIX</h2>
            <p>
              XFLIX is a free, ad-supported video streaming platform dedicated to providing users with access to a wide variety of movies and TV shows. Our mission is to make entertainment accessible to everyone, anywhere, at no cost.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Company Information</h2>
            <div className="bg-gray-800/50 rounded-lg p-6 space-y-3 border border-gray-700">
              <div>
                <h3 className="font-semibold text-white mb-1">Service Name</h3>
                <p className="text-gray-400">XFLIX</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Type</h3>
                <p className="text-gray-400">Video Streaming Aggregator Platform</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Business Model</h3>
                <p className="text-gray-400">Ad-Supported Free Streaming Service</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Website</h3>
                <p className="text-gray-400">https://xflix.com</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Our Service</h2>

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">What We Do</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide a free platform for streaming movies and TV shows</li>
              <li>Aggregate content from multiple third-party streaming sources</li>
              <li>Offer an intuitive, user-friendly interface for content discovery</li>
              <li>Support our service through ethical advertising partnerships</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">What We Don't Do</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Host or upload any video content</li>
              <li>Store copyrighted material on our servers</li>
              <li>Require user accounts or subscriptions</li>
              <li>Charge any fees for our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Revenue Model</h2>
            <p className="mb-3">
              XFLIX operates as a completely free service for users. Our revenue is generated exclusively through:
            </p>
            <div className="bg-gray-800/50 rounded-lg p-6 space-y-3 border border-gray-700">
              <div>
                <h3 className="font-semibold text-white mb-2">Display Advertising</h3>
                <p className="text-gray-400">Banner ads and video pre-roll advertisements from partners like Google AdSense</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Programmatic Advertising</h3>
                <p className="text-gray-400">Automated ad serving based on user demographics and interests</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Affiliate Partnerships</h3>
                <p className="text-gray-400">Revenue sharing with streaming service providers</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Content Policy</h2>

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">Content Sources</h3>
            <p className="mb-3">
              XFLIX functions as an aggregator platform. We do not host, upload, or maintain any video files. All content is embedded from third-party sources that are publicly available on the internet.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">Copyright Compliance</h3>
            <p className="mb-3">
              We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA):
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>We respond promptly to valid DMCA takedown notices</li>
              <li>We remove infringing content upon notification</li>
              <li>We do not actively monitor third-party content</li>
              <li>We maintain a designated agent for copyright notices</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-4">Reporting Violations</h3>
            <p className="mb-3">
              If you believe content on our platform infringes your copyright, please contact our DMCA agent:
            </p>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p>Email: dmca@xflix.com</p>
              <p className="text-sm text-gray-400 mt-2">
                Please include: Description of copyrighted work, URL of infringing content, your contact information, and a statement of good faith belief.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Advertising Partners</h2>
            <p className="mb-3">
              We work with reputable advertising networks to serve ads on our platform:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Google AdSense:</strong> Primary advertising partner for display and video ads</li>
              <li><strong>Third-party ad networks:</strong> Additional advertising partners for programmatic advertising</li>
            </ul>
            <p className="mt-3 text-sm text-gray-400">
              All advertising partners are required to comply with applicable advertising standards and privacy regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Technology</h2>
            <div className="bg-gray-800/50 rounded-lg p-6 space-y-3 border border-gray-700">
              <div>
                <h3 className="font-semibold text-white mb-1">Platform</h3>
                <p className="text-gray-400">Web-based streaming aggregator</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Infrastructure</h3>
                <p className="text-gray-400">Content delivery through third-party streaming providers</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Data Storage</h3>
                <p className="text-gray-400">No video content storage; metadata only</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Commitment to Users</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-xflix-red rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p><strong className="text-white">Free Forever:</strong> We will never charge users for access to our platform</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-xflix-red rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p><strong className="text-white">Privacy Focused:</strong> We minimize data collection and respect user privacy</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-xflix-red rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p><strong className="text-white">No Registration:</strong> Access content without creating an account</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-xflix-red rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p><strong className="text-white">Transparent:</strong> Clear about our business model and content sources</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-xflix-red rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p><strong className="text-white">Responsive:</strong> Quick to address copyright and legal concerns</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Legal Compliance</h2>
            <p className="mb-3">XFLIX is committed to operating in compliance with:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Digital Millennium Copyright Act (DMCA)</li>
              <li>General Data Protection Regulation (GDPR)</li>
              <li>California Consumer Privacy Act (CCPA)</li>
              <li>Children's Online Privacy Protection Act (COPPA)</li>
              <li>ePrivacy Directive (Cookie Law)</li>
              <li>Applicable advertising standards and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
            <div className="bg-gray-800 p-6 rounded-lg space-y-3">
              <div>
                <h3 className="font-semibold text-white mb-1">General Inquiries</h3>
                <p className="text-gray-400">Email: info@xflix.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Legal & Copyright</h3>
                <p className="text-gray-400">Email: legal@xflix.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">DMCA Notices</h3>
                <p className="text-gray-400">Email: dmca@xflix.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Advertising Partnerships</h3>
                <p className="text-gray-400">Email: advertising@xflix.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Privacy Concerns</h3>
                <p className="text-gray-400">Email: privacy@xflix.com</p>
              </div>
            </div>
          </section>

          <section className="mt-8 p-6 bg-gradient-to-r from-xflix-red/10 to-transparent rounded-lg border border-xflix-red/20">
            <h3 className="text-xl font-semibold text-white mb-3">Our Mission</h3>
            <p className="text-lg">
              "To democratize access to entertainment by providing a free, accessible platform for discovering and enjoying movies and TV shows from around the world."
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
