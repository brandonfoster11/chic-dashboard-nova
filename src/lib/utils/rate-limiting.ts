/**
 * Rate limiting utility for authentication attempts
 * Uses a simple in-memory store with IP and user-based rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  windowMs: number;  // Time window in milliseconds
  maxAttempts: number;  // Maximum number of attempts allowed in the window
  blockDurationMs?: number;  // How long to block after max attempts (defaults to windowMs)
}

export class RateLimiter {
  private ipStore: Map<string, RateLimitEntry> = new Map();
  private userStore: Map<string, RateLimitEntry> = new Map();
  private options: RateLimitOptions;
  
  constructor(options: RateLimitOptions) {
    this.options = {
      ...options,
      blockDurationMs: options.blockDurationMs || options.windowMs
    };
    
    // Set up cleanup interval to remove expired entries
    setInterval(() => this.cleanup(), Math.min(options.windowMs, 60 * 1000));
  }
  
  /**
   * Check if an IP address is rate limited
   * @param ip - The IP address to check
   * @returns Whether the IP is rate limited
   */
  isIpLimited(ip: string): boolean {
    const now = Date.now();
    const entry = this.ipStore.get(ip);
    
    if (!entry) {
      return false;
    }
    
    // If the reset time has passed, reset the counter
    if (now > entry.resetAt) {
      this.ipStore.delete(ip);
      return false;
    }
    
    return entry.count >= this.options.maxAttempts;
  }
  
  /**
   * Check if a user is rate limited
   * @param userId - The user ID to check
   * @returns Whether the user is rate limited
   */
  isUserLimited(userId: string): boolean {
    const now = Date.now();
    const entry = this.userStore.get(userId);
    
    if (!entry) {
      return false;
    }
    
    // If the reset time has passed, reset the counter
    if (now > entry.resetAt) {
      this.userStore.delete(userId);
      return false;
    }
    
    return entry.count >= this.options.maxAttempts;
  }
  
  /**
   * Increment the rate limit counter for an IP address
   * @param ip - The IP address to increment
   */
  incrementIp(ip: string): void {
    const now = Date.now();
    const entry = this.ipStore.get(ip);
    
    if (!entry || now > entry.resetAt) {
      // Create a new entry
      this.ipStore.set(ip, {
        count: 1,
        resetAt: now + this.options.windowMs
      });
      return;
    }
    
    // If this increment exceeds the limit, extend the block duration
    if (entry.count + 1 >= this.options.maxAttempts) {
      entry.resetAt = now + (this.options.blockDurationMs || this.options.windowMs);
    }
    
    // Increment the counter
    entry.count += 1;
  }
  
  /**
   * Increment the rate limit counter for a user
   * @param userId - The user ID to increment
   */
  incrementUser(userId: string): void {
    const now = Date.now();
    const entry = this.userStore.get(userId);
    
    if (!entry || now > entry.resetAt) {
      // Create a new entry
      this.userStore.set(userId, {
        count: 1,
        resetAt: now + this.options.windowMs
      });
      return;
    }
    
    // If this increment exceeds the limit, extend the block duration
    if (entry.count + 1 >= this.options.maxAttempts) {
      entry.resetAt = now + (this.options.blockDurationMs || this.options.windowMs);
    }
    
    // Increment the counter
    entry.count += 1;
  }
  
  /**
   * Reset the rate limit counter for an IP address
   * @param ip - The IP address to reset
   */
  resetIp(ip: string): void {
    this.ipStore.delete(ip);
  }
  
  /**
   * Reset the rate limit counter for a user
   * @param userId - The user ID to reset
   */
  resetUser(userId: string): void {
    this.userStore.delete(userId);
  }
  
  /**
   * Get the time remaining until an IP address can try again
   * @param ip - The IP address to check
   * @returns Time remaining in milliseconds, or 0 if not limited
   */
  getIpTimeRemaining(ip: string): number {
    const now = Date.now();
    const entry = this.ipStore.get(ip);
    
    if (!entry || entry.count < this.options.maxAttempts) {
      return 0;
    }
    
    return Math.max(0, entry.resetAt - now);
  }
  
  /**
   * Get the time remaining until a user can try again
   * @param userId - The user ID to check
   * @returns Time remaining in milliseconds, or 0 if not limited
   */
  getUserTimeRemaining(userId: string): number {
    const now = Date.now();
    const entry = this.userStore.get(userId);
    
    if (!entry || entry.count < this.options.maxAttempts) {
      return 0;
    }
    
    return Math.max(0, entry.resetAt - now);
  }
  
  /**
   * Clean up expired entries to prevent memory leaks
   */
  private cleanup(): void {
    const now = Date.now();
    
    // Clean up IP store
    for (const [ip, entry] of this.ipStore.entries()) {
      if (now > entry.resetAt) {
        this.ipStore.delete(ip);
      }
    }
    
    // Clean up user store
    for (const [userId, entry] of this.userStore.entries()) {
      if (now > entry.resetAt) {
        this.userStore.delete(userId);
      }
    }
  }
}
