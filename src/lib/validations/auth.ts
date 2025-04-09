import * as z from 'zod';
import { sanitizeText, sanitizeEmail } from '../utils/sanitization';

// Regular expression for strong password validation
// Requires at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Regular expression for name validation (letters, spaces, hyphens, and apostrophes only)
const nameRegex = /^[a-zA-Z\s'-]+$/;

// Maximum input lengths for security
const MAX_EMAIL_LENGTH = 64;
const MAX_PASSWORD_LENGTH = 64;
const MAX_NAME_LENGTH = 50;
const MIN_PASSWORD_LENGTH = 8;
const MIN_NAME_LENGTH = 2;

export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: 'Email is required' })
    .max(MAX_EMAIL_LENGTH, { message: `Email must be less than ${MAX_EMAIL_LENGTH} characters` })
    .email({ message: 'Please enter a valid email address' })
    .transform(sanitizeEmail),
  password: z.string()
    .min(MIN_PASSWORD_LENGTH, { message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` })
    .max(MAX_PASSWORD_LENGTH, { message: `Password must be less than ${MAX_PASSWORD_LENGTH} characters` }),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z.object({
  name: z.string()
    .min(MIN_NAME_LENGTH, { message: `Name must be at least ${MIN_NAME_LENGTH} characters.` })
    .max(MAX_NAME_LENGTH, { message: `Name must be less than ${MAX_NAME_LENGTH} characters.` })
    .refine(val => nameRegex.test(val), {
      message: "Name can only contain letters, spaces, hyphens, and apostrophes."
    })
    .transform(sanitizeText),
  email: z.string()
    .min(1, { message: 'Email is required' })
    .max(MAX_EMAIL_LENGTH, { message: `Email must be less than ${MAX_EMAIL_LENGTH} characters.` })
    .email({ message: "Please enter a valid email address." })
    .transform(sanitizeEmail),
  password: z.string()
    .min(MIN_PASSWORD_LENGTH, { message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` })
    .max(MAX_PASSWORD_LENGTH, { message: `Password must be less than ${MAX_PASSWORD_LENGTH} characters.` })
    .regex(strongPasswordRegex, { 
      message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." 
    }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions."
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: z.string()
    .min(1, { message: 'Email is required' })
    .max(MAX_EMAIL_LENGTH, { message: `Email must be less than ${MAX_EMAIL_LENGTH} characters` })
    .email({ message: 'Please enter a valid email address' })
    .transform(sanitizeEmail),
});

export const newPasswordSchema = z.object({
  password: z.string()
    .min(MIN_PASSWORD_LENGTH, { message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` })
    .max(MAX_PASSWORD_LENGTH, { message: `Password must be less than ${MAX_PASSWORD_LENGTH} characters.` })
    .regex(strongPasswordRegex, { 
      message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." 
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;
