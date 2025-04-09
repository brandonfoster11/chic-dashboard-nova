# Supabase Edge Functions for StyleAI

This directory contains Edge Functions for Supabase, which run in a Deno environment. These functions provide server-side functionality for StyleAI, including rate limiting, authentication verification, and other security features.

## Directory Structure

- `rate-limit.ts` - TypeScript interfaces and mock implementations for local development
- `/deno` - Contains the actual Deno-specific implementations that will be deployed to Supabase Edge Functions

## Rate Limiting Implementation

The rate limiting functionality is implemented in two parts:

1. `rate-limit.ts` - TypeScript interfaces and mock implementations for local development
2. `/deno/rate-limit.ts` - Deno-specific implementation for Supabase Edge Functions

### Configuration

Rate limits are configured for different endpoints:

- `/generate-outfit` → 5 requests per minute
- `/auth/login` → 5 requests per 5 minutes
- `/upload` → 10 requests per hour
- Default: 20 requests per minute

## Deployment

To deploy these functions to Supabase:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Deploy the functions
supabase functions deploy rate-limit --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with your Supabase project reference.

## Usage in Edge Functions

Here's an example of how to use the rate limiting in an Edge Function:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { applyRateLimit } from "./rate-limit.ts";

serve(async (req) => {
  // Apply rate limiting
  const { success, remaining, reset, response } = await applyRateLimit(req, 'generate-outfit');
  
  // If rate limit exceeded, return error response
  if (!success) {
    return response;
  }
  
  // Continue with normal request handling
  // ...
  
  return new Response(
    JSON.stringify({ data: 'Your response data' }),
    { 
      headers: { 
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(reset / 1000).toString(),
      } 
    }
  );
});
```

## Environment Variables

The following environment variables need to be set in your Supabase project:

- `UPSTASH_REDIS_REST_URL` - URL for Upstash Redis
- `UPSTASH_REDIS_REST_TOKEN` - Token for Upstash Redis
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
