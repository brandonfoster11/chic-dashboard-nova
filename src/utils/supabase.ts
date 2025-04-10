import { createClient } from '@supabase/supabase-js'

// Try to get environment variables from different sources
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

// Enhanced debugging for environment variables
console.log('Environment Variables Debug:')
console.log('- import.meta.env available:', typeof import.meta.env !== 'undefined')
console.log('- Supabase URL:', supabaseUrl ? 'Found' : 'Missing')
console.log('- Supabase Anon Key:', supabaseAnonKey ? 'Found' : 'Missing')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file and Vite configuration.')
  console.error('Available import.meta.env keys:', Object.keys(import.meta.env).join(', '))
  throw new Error('Missing Supabase environment variables')
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test the connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection test failed:', error)
  } else {
    console.log('Supabase connection test successful, session:', data.session ? 'Active' : 'None')
  }
})
