/**
 * Utility functions for input sanitization and validation
 */

/**
 * Sanitizes text input by removing HTML tags, script tags, and trimming whitespace
 * @param input - The input string to sanitize
 * @returns The sanitized string
 */
export const sanitizeText = (input: string): string => {
  if (!input) return '';
  
  // Remove any HTML tags
  const noHtml = input.replace(/<[^>]*>/g, '');
  
  // Remove potential script injections
  const noScript = noHtml.replace(/javascript:/gi, '');
  
  // Remove excessive whitespace (more than one space)
  const normalizedSpaces = noScript.replace(/\s+/g, ' ');
  
  // Trim whitespace and return
  return normalizedSpaces.trim();
};

/**
 * Sanitizes an email address by trimming and converting to lowercase
 * @param email - The email to sanitize
 * @returns The sanitized email
 */
export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  return email.trim().toLowerCase();
};

/**
 * Sanitizes a URL by removing potentially dangerous protocols
 * @param url - The URL to sanitize
 * @returns The sanitized URL
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  // Trim the URL
  const trimmedUrl = url.trim();
  
  // Check if URL has a valid protocol (http, https)
  const hasValidProtocol = /^(https?:\/\/)/i.test(trimmedUrl);
  
  // If URL doesn't have a valid protocol, return empty string
  if (!hasValidProtocol) {
    return '';
  }
  
  // Remove potential script injections
  return trimmedUrl.replace(/javascript:/gi, '');
};

/**
 * Sanitizes an array of strings
 * @param items - The array of strings to sanitize
 * @returns The sanitized array of strings
 */
export const sanitizeArray = (items: string[]): string[] => {
  if (!items || !Array.isArray(items)) return [];
  return items.map(sanitizeText).filter(Boolean);
};
