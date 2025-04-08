import { supabase } from '@/utils/supabase'
import { User } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export class AuthService {
  private static instance: AuthService

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async signIn(email: string, password: string): Promise<AuthState> {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return {
        user,
        isLoading: false,
        error: null
      }
    } catch (error) {
      return {
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }
    }
  }

  async signUp(email: string, password: string): Promise<AuthState> {
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) throw error

      return {
        user,
        isLoading: false,
        error: null
      }
    } catch (error) {
      return {
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }
    }
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut()
  }

  async getUser(): Promise<AuthState> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) throw error

      return {
        user,
        isLoading: false,
        error: null
      }
    } catch (error) {
      return {
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }
    }
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    const { data } = supabase.auth.onAuthStateChange(callback)
    return data.subscription
  }
}
