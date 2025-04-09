import { supabase } from '@/utils/supabase'
import { User } from '@supabase/supabase-js'
import { RateLimiter } from '@/lib/utils/rate-limiting'
import { validateData } from '@/lib/middleware/validation'
import { loginSchema, registerSchema } from '@/lib/validations/auth'

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  rateLimited?: boolean
  retryAfter?: number
}

export class AuthService {
  private static instance: AuthService
  private rateLimiter: RateLimiter

  private constructor() {
    // Initialize rate limiter with configuration
    // 5 attempts per 15 minutes, block for 30 minutes after exceeding
    this.rateLimiter = new RateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxAttempts: 5, // 5 attempts
      blockDurationMs: 30 * 60 * 1000 // 30 minutes block
    })
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async signIn(email: string, password: string, ipAddress: string = 'unknown'): Promise<AuthState> {
    try {
      // Validate input data
      const validationResult = validateData(loginSchema, { email, password });
      if (!validationResult.success) {
        return {
          user: null,
          isLoading: false,
          error: 'Invalid email or password format'
        };
      }

      // Check if IP is rate limited
      if (this.rateLimiter.isIpLimited(ipAddress)) {
        const retryAfter = this.rateLimiter.getIpTimeRemaining(ipAddress);
        return {
          user: null,
          isLoading: false,
          error: 'Too many login attempts. Please try again later.',
          rateLimited: true,
          retryAfter
        };
      }

      // Check if email is rate limited
      if (this.rateLimiter.isUserLimited(email)) {
        const retryAfter = this.rateLimiter.getUserTimeRemaining(email);
        return {
          user: null,
          isLoading: false,
          error: 'Too many login attempts for this account. Please try again later.',
          rateLimited: true,
          retryAfter
        };
      }

      // Attempt to sign in
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: validationResult.data.email,
        password: validationResult.data.password
      })

      // If error, increment rate limit counters
      if (error) {
        this.rateLimiter.incrementIp(ipAddress);
        this.rateLimiter.incrementUser(email);
        
        // Log authentication failure to MFA logs table
        await this.logAuthEvent(email, 'login_failed', ipAddress);
        
        throw error;
      }

      // On successful login, reset rate limiters
      this.rateLimiter.resetIp(ipAddress);
      this.rateLimiter.resetUser(email);
      
      // Log successful authentication to MFA logs table
      await this.logAuthEvent(email, 'login_success', ipAddress);

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

  async signUp(email: string, password: string, name?: string, ipAddress: string = 'unknown'): Promise<AuthState> {
    try {
      // Validate input data
      const validationResult = validateData(registerSchema, { 
        email, 
        password, 
        confirmPassword: password,
        name: name || '',
        terms: true
      });
      
      if (!validationResult.success) {
        return {
          user: null,
          isLoading: false,
          error: 'Invalid registration data'
        };
      }

      // Check if IP is rate limited
      if (this.rateLimiter.isIpLimited(ipAddress)) {
        const retryAfter = this.rateLimiter.getIpTimeRemaining(ipAddress);
        return {
          user: null,
          isLoading: false,
          error: 'Too many registration attempts. Please try again later.',
          rateLimited: true,
          retryAfter
        };
      }

      // Attempt to sign up
      const { data: { user }, error } = await supabase.auth.signUp({
        email: validationResult.data.email,
        password: validationResult.data.password,
        options: {
          data: {
            name: validationResult.data.name
          }
        }
      })

      // If error, increment rate limit counter for IP
      if (error) {
        this.rateLimiter.incrementIp(ipAddress);
        
        // Log registration failure to MFA logs table
        await this.logAuthEvent(email, 'registration_failed', ipAddress);
        
        throw error;
      }

      // Log successful registration to MFA logs table
      await this.logAuthEvent(email, 'registration_success', ipAddress);

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

  /**
   * Log authentication events to the MFA logs table
   * @param email - User email
   * @param event_type - Type of event (login_success, login_failed, etc.)
   * @param ip_address - IP address of the request
   */
  private async logAuthEvent(email: string, event_type: string, ip_address: string): Promise<void> {
    try {
      await supabase
        .from('mfa_logs')
        .insert({
          email,
          event_type,
          ip_address,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log authentication event:', error);
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
