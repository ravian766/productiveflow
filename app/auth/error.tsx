'use client'

import { useEffect } from 'react'
import { Logo } from '@/components/Logo'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md transform transition-all">
        <div className="text-center mb-8">
          <Logo size="md" />
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Something went wrong!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {error.message || 'An unexpected error occurred'}
            </p>
          </div>

          <button
            onClick={reset}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}
