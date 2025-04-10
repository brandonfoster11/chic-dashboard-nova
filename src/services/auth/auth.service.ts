import { supabase } from '@/utils/supabase'
import { User } from '@supabase/supabase-js'
import { RateLimiter } from '@/lib/utils/rate-limiting'
import { validateData } from '@/lib/middleware/validation'
import { loginSchema, registerSchema } from '@/lib/validations/auth'
import { checkDatabaseStatus, getDbStatusMessage } from '@/utils/db-status'

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  rateLimited?: boolean
  retryAfter?: number
  dbStatus?: {
    isConnected: boolean;
    hasPermissions: boolean;
  }
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
      console.log('AuthService: Attempting to sign in with email:', email);
      
      // TEMPORARY: For testing purposes, allow a mock user to login
      if (email === 'test@example.com' && password === 'Password123!') {
        console.log('AuthService: Using mock user for testing');
        return {
          user: {
            id: 'mock-user-id',
            email: 'test@example.com',
            app_metadata: {},
            user_metadata: { name: 'Test User' },
            aud: 'authenticated',
            created_at: new Date().toISOString()
          } as User,
          isLoading: false,
          error: null
        };
      }
      
      // Validate input data
      const validationResult = validateData(loginSchema, { email, password });
      if (!validationResult.success) {
        console.error('AuthService: Validation failed:', validationResult.errors || validationResult.message);
        return {
          user: null,
          isLoading: false,
          error: 'Invalid email or password format. Please check your input.'
        };
      }

      console.log('AuthService: Input validation successful');
      
      // Check if IP is rate limited
      if (this.rateLimiter.isIpLimited(ipAddress)) {
        const retryAfter = this.rateLimiter.getIpTimeRemaining(ipAddress);
        console.warn('AuthService: IP is rate limited:', ipAddress);
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
        console.warn('AuthService: Email is rate limited:', email);
        return {
          user: null,
          isLoading: false,
          error: 'Too many login attempts for this account. Please try again later.',
          rateLimited: true,
          retryAfter
        };
      }

      console.log('AuthService: Rate limit checks passed, attempting Supabase login');
      
      // Check database status
      const dbStatus = await checkDatabaseStatus();
      if (!dbStatus.isConnected || !dbStatus.hasPermissions) {
        console.error('AuthService: Database status check failed:', getDbStatusMessage(dbStatus));
        return {
          user: null,
          isLoading: false,
          error: 'Authentication service is currently experiencing issues. Please try the test account or contact support.',
          dbStatus
        };
      }

      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: validationResult.data.email,
        password: validationResult.data.password
      });

      // If error, increment rate limit counters
      if (error) {
        console.error('AuthService: Supabase login failed:', error.message);
        
        // Handle specific database error
        if (error.message.includes('Database error granting user')) {
          console.warn('AuthService: This appears to be a database permission issue');
          return {
            user: null,
            isLoading: false,
            error: 'Authentication service is currently experiencing issues. Please try the test account or contact support.',
            dbStatus
          };
        }
        
        this.rateLimiter.incrementIp(ipAddress);
        this.rateLimiter.incrementUser(email);
        
        // Log authentication failure to MFA logs table
        try {
          await this.logAuthEvent(email, 'login_failed', ipAddress);
        } catch (logError) {
          console.error('AuthService: Failed to log auth event:', logError);
        }
        
        return {
          user: null,
          isLoading: false,
          error: error.message || 'Invalid email or password. Please try again.',
          dbStatus
        };
      }

      console.log('AuthService: Login successful for user:', data.user?.id);
      
      // On successful login, reset rate limiters
      this.rateLimiter.resetIp(ipAddress);
      this.rateLimiter.resetUser(email);
      
      // Log successful authentication to MFA logs table
      try {
        await this.logAuthEvent(email, 'login_success', ipAddress);
      } catch (logError) {
        console.error('AuthService: Failed to log auth event:', logError);
      }

      return {
        user: data.user,
        isLoading: false,
        error: null,
        dbStatus
      };
    } catch (error) {
      console.error('AuthService: Unexpected error during login:', error);
      return {
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred during login',
        dbStatus: await checkDatabaseStatus()
      };
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
          error: 'Invalid registration data',
          dbStatus: await checkDatabaseStatus()
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
          retryAfter,
          dbStatus: await checkDatabaseStatus()
        };
      }

      // Check database status
      const dbStatus = await checkDatabaseStatus();
      if (!dbStatus.isConnected || !dbStatus.hasPermissions) {
        console.error('AuthService: Database status check failed:', getDbStatusMessage(dbStatus));
        return {
          user: null,
          isLoading: false,
          error: 'Authentication service is currently experiencing issues. Please try the test account or contact support.',
          dbStatus
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
        error: null,
        dbStatus
      }
    } catch (error) {
      return {
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
        dbStatus: await checkDatabaseStatus()
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
        error: null,
        dbStatus: await checkDatabaseStatus()
      }
    } catch (error) {
      return {
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
        dbStatus: await checkDatabaseStatus()
      }
    }
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    const { data } = supabase.auth.onAuthStateChange(callback)
    return data.subscription
  }
}
