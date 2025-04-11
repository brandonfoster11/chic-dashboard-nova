import { dataProvider, User } from '../data';

/**
 * Auth state interface
 */
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  rateLimited?: boolean;
  retryAfter?: number;
}

/**
 * Mock Authentication Service
 * Provides authentication functionality without Supabase dependency
 */
export class MockAuthService {
  private static instance: MockAuthService;
  
  private constructor() {
    console.log('MockAuthService initialized');
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): MockAuthService {
    if (!MockAuthService.instance) {
      MockAuthService.instance = new MockAuthService();
    }
    return MockAuthService.instance;
  }
  
  /**
   * Get current session
   */
  async getSession(): Promise<AuthState> {
    console.log('MockAuthService: Getting current session');
    
    try {
      // In development mode, get user from data provider
      const user = await dataProvider.getUser();
      
      return {
        user,
        isLoading: false,
        error: null
      };
    } catch (error) {
      console.error('Error getting session:', error);
      return {
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to get session'
      };
    }
  }
  
  /**
   * Sign in user
   */
  async signIn(email: string, password: string): Promise<AuthState> {
    console.log('MockAuthService: Starting signIn process', { email });
    
    try {
      // In development mode, always succeed with mock user
      const user = await dataProvider.getUser();
      
      if (!user) {
        return {
          user: null,
          isLoading: false,
          error: 'User not found'
        };
      }
      
      console.log('MockAuthService: Login successful');
      return {
        user,
        isLoading: false,
        error: null
      };
    } catch (error) {
      console.error('MockAuthService: Error during sign in', error);
      return {
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign in'
      };
    }
  }
  
  /**
   * Sign up new user
   */
  async signUp(email: string, password: string, name?: string): Promise<AuthState> {
    console.log('MockAuthService: Starting signUp process', { email, name });
    
    try {
      // In development mode, always succeed with mock user
      const user = await dataProvider.getUser();
      
      if (name) {
        // Update user name if provided
        await dataProvider.updateUser({ ...user!, name });
      }
      
      console.log('MockAuthService: Registration successful');
      return {
        user: user!,
        isLoading: false,
        error: null
      };
    } catch (error) {
      console.error('MockAuthService: Error during sign up', error);
      return {
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign up'
      };
    }
  }
  
  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    console.log('MockAuthService: User signed out');
    // In a real implementation, this would clear session data
  }
  
  /**
   * Get current user
   */
  async getUser(): Promise<AuthState> {
    try {
      const user = await dataProvider.getUser();
      return {
        user,
        isLoading: false,
        error: null
      };
    } catch (error) {
      console.error('MockAuthService: Error getting user', error);
      return {
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to get user'
      };
    }
  }
  
  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    console.log('MockAuthService: Resetting password for', email);
    
    // In mock mode, we just simulate success
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // No return value needed, will throw error if fails
  }
  
  /**
   * Update user profile
   */
  async updateProfile(data: { name?: string; avatar_url?: string }): Promise<AuthState> {
    console.log('MockAuthService: Updating profile', data);
    
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
  
  /**
   * Listen for auth state changes
   * In this mock implementation, this doesn't do anything meaningful
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    // In a real implementation, this would set up listeners
    // For mock, we just return a dummy unsubscribe function
    return {
      unsubscribe: () => {}
    };
  }
}
