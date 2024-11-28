import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

type CacheControlOptions = {
  public?: boolean
  maxAge?: number
  staleWhileRevalidate?: number
  mustRevalidate?: boolean
}

export function setCacheHeaders(
  response: NextResponse,
  options: CacheControlOptions = {}
) {
  const {
    public: isPublic = true,
    maxAge = 60,
    staleWhileRevalidate = 30,
    mustRevalidate = false,
  } = options

  const directives = [
    isPublic ? 'public' : 'private',
    `max-age=${maxAge}`,
    `stale-while-revalidate=${staleWhileRevalidate}`,
  ]

  if (mustRevalidate) {
    directives.push('must-revalidate')
  }

  response.headers.set('Cache-Control', directives.join(', '))
  return response
}

export function shouldRevalidate(request: Request): boolean {
  const headersList = headers()
  const cacheControl = headersList.get('cache-control')
  
  if (!cacheControl) return true
  
  const noCache = cacheControl.includes('no-cache')
  const noStore = cacheControl.includes('no-store')
  
  return noCache || noStore
}

export async function cachedFetch<T>(
  url: string,
  options: RequestInit & { revalidate?: number | false } = {}
): Promise<T> {
  const { revalidate, ...fetchOptions } = options
  
  const response = await fetch(url, {
    ...fetchOptions,
    next: {
      revalidate: revalidate,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}
