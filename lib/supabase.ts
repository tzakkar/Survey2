// Supabase client for reading data when Prisma connection fails
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sjjzoxcmtgzbyunnmopo.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_enVwtG3Uu6QE9xj0hPWf4w_ZdAREIqD'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'sb_secret_zCT0fuw-S4tDjdoi-aobFw_wDhb1x0K'

// Custom fetch with timeout and retry logic for better error handling
// IMPORTANT: Preserves all headers including Supabase's apikey and Authorization headers
const customFetch = async (input: RequestInfo | URL, init?: RequestInit, retries = 2): Promise<Response> => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
  const options = init || {}
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

  try {
    // Preserve all existing headers properly
    let headers: Headers
    if (options.headers instanceof Headers) {
      headers = new Headers(options.headers)
    } else if (Array.isArray(options.headers)) {
      headers = new Headers(options.headers)
    } else if (options.headers) {
      headers = new Headers(options.headers as Record<string, string>)
    } else {
      headers = new Headers()
    }
    
    // Add keep-alive
    headers.set('Connection', 'keep-alive')
    
    // Ensure API key is present (Supabase client should add this, but we ensure it's there)
    if (!headers.has('apikey') && SUPABASE_SERVICE_KEY) {
      headers.set('apikey', SUPABASE_SERVICE_KEY)
    }
    if (!headers.has('Authorization') && SUPABASE_SERVICE_KEY) {
      headers.set('Authorization', `Bearer ${SUPABASE_SERVICE_KEY}`)
    }

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: headers,
    })
    clearTimeout(timeoutId)
    
    // Retry on 5xx errors
    if (response.status >= 500 && retries > 0) {
      clearTimeout(timeoutId)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return customFetch(url, options, retries - 1)
    }
    
    return response
  } catch (error: any) {
    clearTimeout(timeoutId)
    
    // Retry on network errors
    if (retries > 0 && (error.name === 'AbortError' || error.message?.includes('fetch failed'))) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      return customFetch(url, options, retries - 1)
    }
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout: Unable to reach Supabase API after retries')
    }
    throw error
  }
}

// Use service key for server-side operations
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  },
  global: {
    fetch: customFetch,
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
    }
  }
})

