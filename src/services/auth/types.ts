export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthService {
  login(email: string, password: string): Promise<User>;
  register(name: string, email: string, password: string): Promise<User>;
  resetPassword(email: string): Promise<void>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
