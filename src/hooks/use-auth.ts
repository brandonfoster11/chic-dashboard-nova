import { useState, useEffect } from 'react'
import { AuthState, AuthService } from '@/services/auth/auth.service'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    const authService = AuthService.getInstance()

    const subscription = authService.onAuthStateChange((event, session) => {
      setAuthState({
        user: session?.user ?? null,
        isLoading: false,
        error: null
      })
    })

    // Initial user fetch
    const fetchUser = async () => {
      const result = await authService.getUser()
      setAuthState(result)
    }
    fetchUser()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const authService = AuthService.getInstance()
    const result = await authService.signIn(email, password)
    setAuthState(result)
    return result
  }

  const signUp = async (email: string, password: string) => {
    const authService = AuthService.getInstance()
    const result = await authService.signUp(email, password)
    setAuthState(result)
    return result
  }

  const signOut = async () => {
    const authService = AuthService.getInstance()
    await authService.signOut()
    setAuthState({
      user: null,
      isLoading: false,
      error: null
    })
  }

  return {
    ...authState,
    signIn,
    signUp,
    signOut
  }
}
