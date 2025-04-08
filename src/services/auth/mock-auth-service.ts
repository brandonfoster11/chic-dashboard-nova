import { AuthService, User } from './types';

// Mock user database
const MOCK_USERS: Record<string, User & { password: string }> = {
  'user@example.com': {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User',
    password: 'password123',
    createdAt: new Date().toISOString(),
  },
};

export class MockAuthService implements AuthService {
  async login(email: string, password: string): Promise<User> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = MOCK_USERS[email];
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }
    
    // Don't store password in localStorage
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }
  
  async register(name: string, email: string, password: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (MOCK_USERS[email]) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password,
      createdAt: new Date().toISOString(),
    };
    
    MOCK_USERS[email] = newUser;
    
    // Don't store password in localStorage
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }
  
  async resetPassword(email: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!MOCK_USERS[email]) {
      throw new Error('User not found');
    }
    
    console.log(`Password reset email sent to ${email}`);
  }
  
  async logout(): Promise<void> {
    localStorage.removeItem('currentUser');
  }
  
  async getCurrentUser(): Promise<User | null> {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
}
