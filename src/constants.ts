/**
 * Global application constants
 */

/**
 * When true, the application will use mock data and bypass authentication
 * This enables a fully clickable UI experience without requiring backend services
 */
export const USE_MOCKS = true;

/**
 * Mock user data for design mode
 */
export const MOCK_USER = {
  id: "mock-user-id",
  email: "demo@styleai.app",
  name: "Demo User",
  avatar_url: "/avatars/default.png",
  role_id: 1,
  created_at: new Date().toISOString()
};
