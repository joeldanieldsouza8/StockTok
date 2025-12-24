"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function DevPage() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testDummyEndpoint = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch("/api/dummy")
      const data = await res.json()

      if (!res.ok) {
        setError(`Error ${res.status}: ${JSON.stringify(data, null, 2)}`)
      } else {
        setResponse(data)
      }
    } catch (err: any) {
      setError(`Network Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 Dev Testing Page</h1>
          <p className="text-gray-600">Test API endpoints and view responses</p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Development Only:</strong> This page should not be accessible in production.
            </p>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test /api/dummy Endpoint</h2>
          <p className="text-sm text-gray-600 mb-4">
            This endpoint tests authentication and backend communication. Check the terminal logs for the access token.
          </p>
          
          <Button 
            onClick={testDummyEndpoint} 
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Testing..." : "🧪 Test Dummy Endpoint"}
          </Button>
        </Card>

        {/* Response Section */}
        {response && (
          <Card className="p-6 mb-6 bg-green-50 border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-3">✅ Success Response</h3>
            <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm border border-green-300">
              {JSON.stringify(response, null, 2)}
            </pre>
          </Card>
        )}

        {/* Error Section */}
        {error && (
          <Card className="p-6 mb-6 bg-red-50 border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-3">❌ Error Response</h3>
            <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm border border-red-300 text-red-700">
              {error}
            </pre>
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📝 Instructions</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• <strong>Login Required:</strong> Make sure you're logged in via Auth0</li>
            <li>• <strong>Check Terminal:</strong> The access token will be logged in the Next.js terminal</li>
            <li>• <strong>Backend Running:</strong> Ensure the backend API is running on the configured URL</li>
            <li>• <strong>Expected Response:</strong> Should return data from the backend's /dummy endpoint</li>
          </ul>
          
          <div className="mt-4 p-3 bg-white rounded border border-blue-300">
            <p className="text-xs text-gray-600 font-mono">
              Backend URL: {process.env.NEXT_PUBLIC_BACKEND_API_URL || "Not configured"}
            </p>
          </div>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 flex gap-4 flex-wrap">
          <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
          <a href="/health" className="text-blue-600 hover:underline">Health Check →</a>
          <a href="/api/auth/login" className="text-blue-600 hover:underline">Login →</a>
        </div>
      </div>
    </div>
  )
}
