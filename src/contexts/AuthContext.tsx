import React, { createContext, useContext, useEffect, useState } from 'react';
import { USE_MOCKS } from '@/constants';
import { toast } from '@/components/ui/use-toast';
import { MockAuthService, AuthState } from '@/services/auth/mock-auth.service';

// Mock user for design mode
export const MOCK_USER = {
  id: 'mock-user-id',
  email: 'user@example.com',
  name: 'Design Mode User',
  avatar_url: '/images/avatars/default.png',
  role_id: 1,
  created_at: new Date().toISOString()
};

// Auth context interface
interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: { name?: string; avatar_url?: string }) => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  });

  // Initialize auth service
  const authService = MockAuthService.getInstance();

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (USE_MOCKS) {
          // In design mode, automatically authenticate with mock user
          setAuthState({
            user: MOCK_USER,
            isLoading: false,
            error: null
          });
          console.log('Design Mode: Auto-authenticated with mock user');
          return;
        }
        
        // Otherwise, check for existing session
        const state = await authService.getSession();
        setAuthState(state);
      } catch (error) {
        console.error('Error loading user:', error);
        setAuthState({
          user: null,
          isLoading: false,
          error: 'Failed to load user session'
        });
      }
    };

    loadUser();
  }, []);

  // Sign in handler
  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      if (USE_MOCKS) {
        // In design mode, always succeed with mock user
        setAuthState({
          user: MOCK_USER,
          isLoading: false,
          error: null
        });
        toast({
          title: "Signed in",
          description: "Welcome to StyleAI Design Mode",
        });
        return;
      }
      
      const state = await authService.signIn(email, password);
      setAuthState(state);
      
      if (state.user) {
        toast({
          title: "Signed in",
          description: "Welcome back to StyleAI",
        });
      } else if (state.error) {
        toast({
          title: "Error",
          description: state.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign in'
      }));
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to sign in',
        variant: "destructive"
      });
    }
  };

  // Sign up handler
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      if (USE_MOCKS) {
        // In design mode, always succeed with mock user
        setAuthState({
          user: MOCK_USER,
          isLoading: false,
          error: null
        });
        toast({
          title: "Account created",
          description: "Welcome to StyleAI Design Mode",
        });
        return;
      }
      
      const state = await authService.signUp(email, password, name);
      setAuthState(state);
      
      if (state.user) {
        toast({
          title: "Account created",
          description: "Welcome to StyleAI",
        });
      } else if (state.error) {
        toast({
          title: "Error",
          description: state.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create account'
      }));
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create account',
        variant: "destructive"
      });
    }
  };

  // Sign out handler
  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      if (USE_MOCKS) {
        // In design mode, just clear the user state
        setAuthState({
          user: null,
          isLoading: false,
          error: null
        });
        toast({
          title: "Signed out",
          description: "You have been signed out of StyleAI Design Mode",
        });
        return;
      }
      
      const state = await authService.signOut();
      setAuthState(state);
      
      toast({
        title: "Signed out",
        description: "You have been signed out of StyleAI",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign out'
      }));
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to sign out',
        variant: "destructive"
      });
    }
  };

  // Reset password handler
  const resetPassword = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      if (USE_MOCKS) {
        // In design mode, just simulate success
        setAuthState(prev => ({ ...prev, isLoading: false }));
        toast({
          title: "Password reset email sent",
          description: "Check your inbox for instructions (Design Mode)",
        });
        return;
      }
      
      await authService.resetPassword(email);
      // Fix the type error by using a callback function
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for instructions",
      });
    } catch (error) {
      console.error('Reset password error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to send reset email'
      }));
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to send reset email',
        variant: "destructive"
      });
    }
  };

  // Update profile handler
  const updateProfile = async (data: { name?: string; avatar_url?: string }) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      if (USE_MOCKS) {
        // In design mode, just update the mock user
        const updatedUser = { ...MOCK_USER, ...data };
        setAuthState({
          user: updatedUser,
          isLoading: false,
          error: null
        });
        toast({
          title: "Profile updated",
          description: "Your profile has been updated (Design Mode)",
        });
        return;
      }
      
      const state = await authService.updateProfile(data);
      setAuthState(state);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated",
      });
    } catch (error) {
      console.error('Update profile error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update profile'
      }));
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: "destructive"
      });
    }
  };

  // Create context value
  const value = {
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
