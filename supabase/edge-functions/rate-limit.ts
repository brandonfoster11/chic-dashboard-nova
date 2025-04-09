/**
 * Rate Limiting Configuration for StyleAI
 * 
 * This file provides TypeScript interfaces and mock implementations for the rate limiting
 * functionality that will be used in Supabase Edge Functions.
 * 
 * The actual implementation is in the ./deno/rate-limit.ts file, which is designed to run
 * in the Deno runtime environment provided by Supabase Edge Functions.
 */

// Rate limit configurations
export const RATE_LIMITS = {
  'generate-outfit': { limit: 5, duration: 60 }, // 5 requests per minute
  'auth': { limit: 5, duration: 300 }, // 5 requests per 5 minutes
  'upload': { limit: 10, duration: 3600 }, // 10 requests per hour
  'default': { limit: 20, duration: 60 } // Default: 20 requests per minute
};

// TypeScript interfaces for rate limiting
export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
  limit?: number;
  response?: Response;
}

export interface RateLimitConfig {
  routeType?: string;
  identifier?: string;
}

/**
 * Mock implementation of rate limiting for development environment
 * The actual implementation is in ./deno/rate-limit.ts for Supabase Edge Functions
 */
export const applyRateLimit = async (
  req: Request, 
  routeType: string = 'default'
): Promise<RateLimitResult> => {
  console.log(`[DEV] Rate limit check for ${routeType}`);
  
  // In development, always return success
  return {
    success: true,
    remaining: 100,
    reset: 0
  };
};

/**
 * Utility to create a rate limit exceeded response
 */
export const createRateLimitExceededResponse = (
  limit: number,
  remaining: number,
  reset: number
): Response => {
  return new Response(
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
  );
};
