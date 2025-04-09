// Rate limiting middleware for Supabase Edge Functions
// Note: This file is meant to be used in a Deno environment (Supabase Edge Functions)
// It will have TypeScript errors in a Node.js environment

// @deno-types="https://esm.sh/v135/@supabase/supabase-js@2.38.4/dist/module/index.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
// @deno-types="https://esm.sh/v135/@upstash/ratelimit@1.0.0/dist/index.d.ts"
import { rateLimit } from 'https://esm.sh/@upstash/ratelimit@1.0.0';
// @deno-types="https://esm.sh/v135/@upstash/redis@1.28.3/dist/index.d.ts"
import { Redis } from 'https://esm.sh/@upstash/redis@1.28.3';

// Configuration
// @ts-ignore - Deno global is not available in Node.js
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
// @ts-ignore - Deno global is not available in Node.js
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

// Rate limit configurations
const RATE_LIMITS = {
  'generate-outfit': { limit: 5, duration: 60 }, // 5 requests per minute
  'auth': { limit: 5, duration: 300 }, // 5 requests per 5 minutes
  'upload': { limit: 10, duration: 3600 }, // 10 requests per hour
  'default': { limit: 20, duration: 60 } // Default: 20 requests per minute
}

// Initialize Redis client for rate limiting
// Note: You'll need to set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in your Supabase Edge Function environment
const redis = new Redis({
  // @ts-ignore - Deno global is not available in Node.js
  url: Deno.env.get('UPSTASH_REDIS_REST_URL') || '',
  // @ts-ignore - Deno global is not available in Node.js
  token: Deno.env.get('UPSTASH_REDIS_REST_TOKEN') || '',
})

/**
 * Middleware to apply rate limiting to Supabase Edge Functions
 * @param {Request} req - The incoming request
 * @param {string} routeType - The type of route ('generate-outfit', 'auth', 'upload', or 'default')
 * @returns {Promise<{success: boolean, remaining: number, reset: number, response?: Response}>}
 */
export async function applyRateLimit(req: Request, routeType: string = 'default') {
  // Get client IP address
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  
  // Get user ID from auth header if available
  let userId = 'anonymous'
  const authHeader = req.headers.get('authorization')
  
  if (authHeader) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
      if (user) {
        userId = user.id
      }
    } catch (error) {
      console.error('Error getting user from auth header:', error)
    }
  }
  
  // Create a unique identifier based on IP and user ID
  const identifier = `${routeType}:${userId !== 'anonymous' ? userId : ip}`
  
  // Get rate limit configuration for this route type
  const config = RATE_LIMITS[routeType as keyof typeof RATE_LIMITS] || RATE_LIMITS.default
  
  // Create rate limiter
  const limiter = rateLimit({
    redis,
    limiter: rateLimit.slidingWindow(config.limit, `${config.duration} s`),
    analytics: true,
    prefix: `styleai:${routeType}`,
  })
  
  // Apply rate limiting
  const { success, remaining, reset, limit } = await limiter.limit(identifier)
  
  // If rate limit exceeded, return error response
  if (!success) {
    const response = new Response(
      JSON.stringify({
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${Math.ceil(reset / 1000)} seconds.`,
        limit,
        remaining,
        reset: Math.ceil(reset / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': Math.ceil(reset / 1000).toString(),
        },
      }
    )
    
    return { success, remaining, reset, response }
  }
  
  // If rate limit not exceeded, return success
  return { success, remaining, reset }
}
