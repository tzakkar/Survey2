// Supabase client for reading data when Prisma connection fails
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sjjzoxcmtgzbyunnmopo.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_enVwtG3Uu6QE9xj0hPWf4w_ZdAREIqD'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'sb_secret_zCT0fuw-S4tDjdoi-aobFw_wDhb1x0K'

// Custom fetch with timeout for better error handling
const customFetch = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('Request timeout: Unable to reach Supabase API')
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
    fetch: customFetch
  }
})

