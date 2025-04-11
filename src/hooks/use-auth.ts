import { useState, useEffect } from 'react'
import { AuthState, AuthService } from '@/services/auth/auth.service'
import { User } from '@/services/data/types'
import { USE_MOCKS } from '@/constants'

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    const authService = AuthService.getInstance()

    // Initial user fetch
    const fetchUser = async () => {
      try {
        const result = await authService.getUser()
        setAuthState(result)
      } catch (error) {
        console.error('Error fetching user:', error)
        setAuthState({
          user: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    fetchUser()

    // In mock mode, we don't have real-time auth state changes
    // So we'll just check periodically for session status in development
    if (USE_MOCKS) {
      const checkInterval = setInterval(() => {
        // Just refresh user data every minute in mock mode
        fetchUser()
      }, 60000)
      
      return () => clearInterval(checkInterval)
    }
    
    return () => {
      // No cleanup needed if not in mock mode
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const authService = AuthService.getInstance()
    const result = await authService.signIn(email, password)
    setAuthState(result)
    return result
  }

  const signUp = async (email: string, password: string, name: string = '') => {
    const authService = AuthService.getInstance()
    const result = await authService.signUp(email, password, name)
    setAuthState(result)
    return result
  }

  const signOut = async () => {
    const authService = AuthService.getInstance()
    const result = await authService.signOut()
    setAuthState(result)
    return result
  }

  const resetPassword = async (email: string) => {
    const authService = AuthService.getInstance()
    return authService.resetPassword(email)
  }

  const updateProfile = async (data: { name?: string; avatar_url?: string }) => {
    const authService = AuthService.getInstance()
    const result = await authService.updateProfile(data)
    if (result.user) {
      setAuthState(result)
    }
    return result
  }

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile
  }
}
