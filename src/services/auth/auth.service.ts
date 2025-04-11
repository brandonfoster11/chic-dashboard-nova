import { RateLimiter } from '@/lib/utils/rate-limiting'
import { validateData } from '@/lib/middleware/validation'
import { loginSchema, registerSchema } from '@/lib/validations/auth'
import { dataProvider } from '../data'
import { User } from '../data/types'

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
    console.log('AuthService: Starting signIn process');
    
    // Development bypass - always succeed in development mode
    const isDevelopmentMode = import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS === 'true';
    
    if (isDevelopmentMode) {
      console.log('AuthService: Development mode detected, bypassing authentication');
      try {
        const user = await dataProvider.getUser();
        return {
          user: user,
          isLoading: false,
          error: null
        };
      } catch (error) {
        console.error('Error getting mock user:', error);
        return {
          user: null,
          isLoading: false,
          error: 'Failed to get mock user'
        };
      }
    }
    
    // Check if the user is rate limited
    const rateLimitCheck = this.rateLimiter.check(ipAddress);
    if (rateLimitCheck.limited) {
      console.log(`AuthService: Rate limited for IP ${ipAddress}`);
      return {
        user: null,
        isLoading: false,
        error: 'Too many login attempts. Please try again later.',
        rateLimited: true,
        retryAfter: rateLimitCheck.retryAfter
      };
    }
    
    try {
      // Validate input data
      const validationResult = validateData(loginSchema, { email, password });
      if (!validationResult.success) {
        console.log('AuthService: Validation failed', validationResult.errors || validationResult.message);
        return {
          user: null,
          isLoading: false,
          error: validationResult.errors ? Object.values(validationResult.errors).join(', ') : validationResult.message || 'Invalid input'
        };
      }
      
      // In a real implementation, this would call the backend
      // For now, we'll just return a mock error since we're in mock mode
      console.log('AuthService: No real auth implementation available');
      return {
        user: null,
        isLoading: false,
        error: 'Authentication service not implemented'
      };
    } catch (error) {
      console.error('AuthService: Error during sign in:', error);
      
      // Record failed attempt for rate limiting
      this.rateLimiter.recordFailedAttempt(ipAddress);
      
      return {
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during sign in'
      };
    }
  }
  
  async signUp(email: string, password: string, name: string, ipAddress: string = 'unknown'): Promise<AuthState> {
    console.log('AuthService: Starting signUp process');
    
    // Development bypass - always succeed in development mode
    const isDevelopmentMode = import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS === 'true';
    
    if (isDevelopmentMode) {
      console.log('AuthService: Development mode detected, bypassing authentication');
      try {
        const user = await dataProvider.getUser();
        return {
          user: user,
          isLoading: false,
          error: null
        };
      } catch (error) {
        console.error('Error getting mock user:', error);
        return {
          user: null,
          isLoading: false,
          error: 'Failed to get mock user'
        };
      }
    }
    
    // Check if the user is rate limited
    const rateLimitCheck = this.rateLimiter.check(ipAddress);
    if (rateLimitCheck.limited) {
      console.log(`AuthService: Rate limited for IP ${ipAddress}`);
      return {
        user: null,
        isLoading: false,
        error: 'Too many registration attempts. Please try again later.',
        rateLimited: true,
        retryAfter: rateLimitCheck.retryAfter
      };
    }
    
    try {
      // Validate input data
      const validationResult = validateData(registerSchema, { email, password, name });
      if (!validationResult.success) {
        console.log('AuthService: Validation failed', validationResult.errors || validationResult.message);
        return {
          user: null,
          isLoading: false,
          error: validationResult.errors ? Object.values(validationResult.errors).join(', ') : validationResult.message || 'Invalid input'
        };
      }
      
      // In a real implementation, this would call the backend
      // For now, we'll just return a mock error since we're in mock mode
      console.log('AuthService: No real auth implementation available');
      return {
        user: null,
        isLoading: false,
        error: 'Authentication service not implemented'
      };
    } catch (error) {
      console.error('AuthService: Error during sign up:', error);
      
      // Record failed attempt for rate limiting
      this.rateLimiter.recordFailedAttempt(ipAddress);
      
      return {
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during registration'
      };
    }
  }
  
  async signOut(): Promise<AuthState> {
    console.log('AuthService: Starting signOut process');
    
    try {
      // In a real implementation, this would call the backend
      // For now, we'll just return a successful signout
      return {
        user: null,
        isLoading: false,
        error: null
      };
    } catch (error) {
      console.error('AuthService: Error during sign out:', error);
      return {
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during sign out'
      };
    }
  }
  
  async getUser(): Promise<AuthState> {
    console.log('AuthService: Getting current user');
    
    // Development bypass - always succeed in development mode
    const isDevelopmentMode = import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS === 'true';
    
    if (isDevelopmentMode) {
      console.log('AuthService: Development mode detected, using mock user');
      try {
        const user = await dataProvider.getUser();
        return {
          user: user,
          isLoading: false,
          error: null
        };
      } catch (error) {
        console.error('Error getting mock user:', error);
        return {
          user: null,
          isLoading: false,
          error: 'Failed to get mock user'
        };
      }
    }
    
    try {
      // In a real implementation, this would call the backend
      // For now, we'll just return a mock error since we're in mock mode
      console.log('AuthService: No real auth implementation available');
      return {
        user: null,
        isLoading: false,
        error: 'Authentication service not implemented'
      };
    } catch (error) {
      console.error('AuthService: Error getting user:', error);
      return {
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred while getting user'
      };
    }
  }
  
  async resetPassword(email: string): Promise<void> {
    console.log('AuthService: Resetting password for', email);
    
    // In mock mode, we just simulate success
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // No return value needed, will throw error if fails
  }
  
  async updateProfile(data: { name?: string; avatar_url?: string }): Promise<AuthState> {
    console.log('AuthService: Updating profile', data);
    
    try {
      // Get current user
      const currentUser = await dataProvider.getUser();
      
      if (!currentUser) {
        return {
          user: null,
          isLoading: false,
          error: 'User not found'
        };
      }
      
      // Update user data
      const updatedUser = await dataProvider.updateUser({
        ...currentUser,
        ...data
      });
      
      return {
        user: updatedUser,
        isLoading: false,
        error: null
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update profile'
      };
    }
  }
}
