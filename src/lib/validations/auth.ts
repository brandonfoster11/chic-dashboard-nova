import * as z from 'zod';

// Regular expression for strong password validation
// Requires at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .email({ message: 'Please enter a valid email address' })
    .max(64, { message: 'Email must be less than 64 characters' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(64, { message: 'Password must be less than 64 characters' }),
});

export const registerSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name must be less than 50 characters." })
    .refine(val => /^[a-zA-Z\s'-]+$/.test(val), {
      message: "Name can only contain letters, spaces, hyphens, and apostrophes."
    }),
  email: z.string()
    .trim()
    .toLowerCase()
    .email({ message: "Please enter a valid email address." })
    .max(64, { message: "Email must be less than 64 characters." }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(64, { message: "Password must be less than 64 characters." })
    .regex(strongPasswordRegex, { 
      message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." 
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .email({ message: 'Please enter a valid email address' })
    .max(64, { message: 'Email must be less than 64 characters' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
