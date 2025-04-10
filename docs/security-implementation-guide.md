# StyleAI Security Implementation Guide

## Overview

This document provides a comprehensive guide to the security implementation in StyleAI, including authentication, authorization, data protection, and compliance measures.

## Authentication & Authorization

### Supabase Authentication

StyleAI uses Supabase Auth for secure user authentication:

```typescript
// Authentication service implementation
export const authService = {
  async signUp(email: string, password: string, userData: Partial<Profile>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    
    if (error) throw error;
    return data;
  },
  
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Other auth methods...
};
```

### Role-Based Access Control (RBAC)

The system implements RBAC with two primary roles:

1. **User Role**: Standard permissions for regular users
2. **Admin Role**: Elevated permissions for administrators

```sql
-- Role definitions in database
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default roles
INSERT INTO roles (name, description) VALUES 
  ('user', 'Regular user with standard permissions'),
  ('admin', 'Administrator with elevated permissions');

-- Add role_id to profiles table
ALTER TABLE profiles ADD COLUMN role_id INTEGER REFERENCES roles(id) DEFAULT 1;
```

### Row Level Security (RLS) Policies

All tables are protected with RLS policies:

```sql
-- Example RLS policy for wardrobe_items table
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own wardrobe items
CREATE POLICY wardrobe_items_select_policy ON wardrobe_items
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own wardrobe items
CREATE POLICY wardrobe_items_insert_policy ON wardrobe_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own wardrobe items
CREATE POLICY wardrobe_items_update_policy ON wardrobe_items
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own wardrobe items
CREATE POLICY wardrobe_items_delete_policy ON wardrobe_items
  FOR DELETE USING (auth.uid() = user_id);

-- Admins can access all wardrobe items
CREATE POLICY wardrobe_items_admin_policy ON wardrobe_items
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id = 2 -- Admin role
    )
  );
```

## Data Protection

### Input Validation & Sanitization

All user inputs are validated and sanitized using Zod schemas:

```typescript
// Example validation schema for wardrobe items
export const wardrobeItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  category: z.string().trim().min(1, "Category is required"),
  subcategory: z.string().trim().optional(),
  color: z.string().trim().optional(),
  pattern: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  seasons: z.array(z.string()).optional(),
  formality: z.number().min(1).max(5).optional(),
  size: z.string().trim().optional(),
  condition: z.string().trim().optional(),
  price: z.number().nonnegative().optional(),
  purchase_date: z.string().optional(),
  notes: z.string().trim().max(500).optional(),
});

// Example of validation in a service
export const wardrobeService = {
  async createItem(item: unknown) {
    // Validate and sanitize input
    const validatedItem = wardrobeItemSchema.parse(item);
    
    // Proceed with database operation
    const { data, error } = await supabase
      .from('wardrobe_items')
      .insert(validatedItem)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Other methods...
};
```

### Password Security

Strong password requirements are enforced:

```typescript
// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password is too long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
  );

// Registration validation schema
export const registerSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

### Secure Storage

Secure file storage for wardrobe images:

```sql
-- Storage bucket configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('wardrobe-images', 'Wardrobe Images', false, 5242880); -- 5MB limit

-- RLS policy for storage
CREATE POLICY "Users can only access their own wardrobe images"
ON storage.objects FOR SELECT
USING (auth.uid() = (storage.foldername(name))[1]::uuid);

CREATE POLICY "Users can upload their own wardrobe images"
ON storage.objects FOR INSERT
WITH CHECK (auth.uid() = (storage.foldername(name))[1]::uuid);

CREATE POLICY "Users can update their own wardrobe images"
ON storage.objects FOR UPDATE
USING (auth.uid() = (storage.foldername(name))[1]::uuid);

CREATE POLICY "Users can delete their own wardrobe images"
ON storage.objects FOR DELETE
USING (auth.uid() = (storage.foldername(name))[1]::uuid);
```

```typescript
// Secure upload path generation
export const generateSecureUploadPath = (userId: string, fileName: string) => {
  const fileExtension = fileName.split('.').pop();
  const randomId = crypto.randomUUID();
  return `${userId}/${randomId}.${fileExtension}`;
};

// Example usage in storage service
export const storageService = {
  async uploadImage(userId: string, file: File) {
    const securePath = generateSecureUploadPath(userId, file.name);
    
    const { data, error } = await supabase.storage
      .from('wardrobe-images')
      .upload(securePath, file);
    
    if (error) throw error;
    return data;
  },
  
  // Other methods...
};
```

## Rate Limiting

Rate limiting is implemented via Supabase Edge Functions:

```typescript
// Edge function for rate limiting
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const RATE_LIMITS = {
  '/generate-outfit': { limit: 5, window: 60 }, // 5 requests per minute
  '/auth/login': { limit: 5, window: 300 }, // 5 requests per 5 minutes
  '/upload': { limit: 10, window: 3600 }, // 10 requests per hour
  'default': { limit: 20, window: 60 }, // 20 requests per minute
};

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );
  
  // Get client IP and path
  const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
  const path = new URL(req.url).pathname;
  
  // Get rate limit config for this path
  const rateConfig = RATE_LIMITS[path] || RATE_LIMITS['default'];
  
  // Check if rate limited
  const { count } = await checkRateLimit(supabase, clientIp, path, rateConfig);
  
  if (count > rateConfig.limit) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Forward the request
  // Implementation depends on your specific setup
});

async function checkRateLimit(supabase, clientIp, path, config) {
  const windowStart = Math.floor(Date.now() / 1000) - config.window;
  
  // Count requests in the time window
  const { count, error } = await supabase.rpc('count_requests', {
    client_ip: clientIp,
    path_value: path,
    window_start: windowStart
  });
  
  // Log this request
  await supabase.from('rate_limit_logs').insert({
    client_ip: clientIp,
    path: path,
    timestamp: new Date().toISOString()
  });
  
  return { count: count || 0, error };
}
```

## MFA Logging

Multi-factor authentication logging infrastructure:

```sql
-- MFA logs table
CREATE TABLE mfa_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  event_type TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policy for MFA logs
ALTER TABLE mfa_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own MFA logs
CREATE POLICY mfa_logs_select_policy ON mfa_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all MFA logs
CREATE POLICY mfa_logs_admin_policy ON mfa_logs
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_id = 2 -- Admin role
    )
  );

-- Trigger for logging authentication events
CREATE OR REPLACE FUNCTION log_auth_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO mfa_logs (user_id, event_type, ip_address, user_agent)
  VALUES (
    NEW.id,
    TG_ARGV[0],
    current_setting('request.headers')::json->>'x-forwarded-for',
    current_setting('request.headers')::json->>'user-agent'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for different auth events
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION log_auth_event('user_created');

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION log_auth_event('user_updated');
```

## CCPA Compliance

Functions for CCPA compliance:

```sql
-- Function to export user data
CREATE OR REPLACE FUNCTION export_user_data(user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_data JSONB;
BEGIN
  -- Get profile data
  SELECT jsonb_build_object(
    'profile', row_to_json(p),
    'wardrobe_items', (
      SELECT jsonb_agg(row_to_json(w))
      FROM wardrobe_items w
      WHERE w.user_id = $1
    ),
    'outfits', (
      SELECT jsonb_agg(row_to_json(o))
      FROM outfits o
      WHERE o.user_id = $1
    ),
    'style_preferences', (
      SELECT jsonb_agg(row_to_json(s))
      FROM style_preferences s
      WHERE s.user_id = $1
    ),
    'outfit_shares', (
      SELECT jsonb_agg(row_to_json(os))
      FROM outfit_shares os
      WHERE os.shared_by = $1 OR os.shared_with = $1
    ),
    'outfit_recommendations', (
      SELECT jsonb_agg(row_to_json(r))
      FROM outfit_recommendations r
      WHERE r.user_id = $1
    )
  ) INTO user_data
  FROM profiles p
  WHERE p.id = $1;
  
  RETURN user_data;
END;
$$;

-- Function to delete user data
CREATE OR REPLACE FUNCTION delete_user_data(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete outfit shares
  DELETE FROM outfit_shares
  WHERE shared_by = user_id OR shared_with = user_id;
  
  -- Delete outfit recommendations
  DELETE FROM outfit_recommendations
  WHERE user_id = user_id;
  
  -- Delete outfit items and outfits
  DELETE FROM outfit_items oi
  USING outfits o
  WHERE oi.outfit_id = o.id AND o.user_id = user_id;
  
  DELETE FROM outfits
  WHERE user_id = user_id;
  
  -- Delete wardrobe items
  DELETE FROM wardrobe_items
  WHERE user_id = user_id;
  
  -- Delete style preferences
  DELETE FROM style_preferences
  WHERE user_id = user_id;
  
  -- Delete profile
  DELETE FROM profiles
  WHERE id = user_id;
  
  -- Note: Actual user deletion from auth.users would be handled by Supabase Auth
  
  RETURN TRUE;
END;
$$;

-- Function to anonymize user data
CREATE OR REPLACE FUNCTION anonymize_user_data(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  anon_id TEXT := 'anon_' || substr(md5(random()::text), 1, 10);
BEGIN
  -- Anonymize profile
  UPDATE profiles
  SET
    username = anon_id,
    full_name = 'Anonymous User',
    avatar_url = NULL
  WHERE id = user_id;
  
  -- Anonymize wardrobe items
  UPDATE wardrobe_items
  SET
    name = 'Anonymized Item',
    brand = NULL,
    notes = NULL
  WHERE user_id = user_id;
  
  -- Keep outfit structure but remove personal data
  UPDATE outfits
  SET
    name = 'Anonymized Outfit',
    description = NULL
  WHERE user_id = user_id;
  
  RETURN TRUE;
END;
$$;
```

## CI/CD Security

GitHub Actions workflow for security scanning:

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 0 * * 0'  # Weekly scan on Sundays

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run npm audit
        run: npm audit --audit-level=moderate
        
      - name: Secret scanning
        uses: gitleaks/gitleaks-action@v2
        
      - name: Dependency review
        uses: actions/dependency-review-action@v3
        if: github.event_name == 'pull_request'
        
      - name: CodeQL Analysis
        uses: github/codeql-action/analyze@v2
        with:
          languages: javascript, typescript
```

## Security Testing

Automated security testing:

```typescript
// Example security test for authentication
describe('Authentication Security', () => {
  it('should enforce password requirements', async () => {
    // Test weak passwords
    const weakPasswords = [
      'password',
      '12345678',
      'qwertyui',
      'UPPERCASE',
      'lowercase',
      'NoSpecial1',
      'NoNumber!',
      'nouppercase1!',
      'NOLOWERCASE1!'
    ];
    
    for (const password of weakPasswords) {
      const result = passwordSchema.safeParse(password);
      expect(result.success).toBe(false);
    }
    
    // Test strong password
    const strongPassword = 'StrongP@ss1';
    const result = passwordSchema.safeParse(strongPassword);
    expect(result.success).toBe(true);
  });
  
  it('should rate limit login attempts', async () => {
    // Implementation depends on your testing setup
  });
  
  // Other tests...
});
```

## Security Best Practices

### Frontend Security

1. **Content Security Policy (CSP)**:
   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://xrzjagfctsvglikwyfxn.supabase.co; connect-src 'self' https://xrzjagfctsvglikwyfxn.supabase.co">
   ```

2. **XSS Prevention**:
   - Use React's built-in XSS protection
   - Sanitize user inputs
   - Avoid dangerouslySetInnerHTML

3. **CSRF Protection**:
   - Supabase Auth includes CSRF protection
   - Use SameSite cookies

### Backend Security

1. **Database Security**:
   - Use parameterized queries
   - Implement RLS policies
   - Limit database user permissions

2. **API Security**:
   - Validate all inputs
   - Implement rate limiting
   - Use HTTPS for all communications

3. **Dependency Management**:
   - Regular security audits
   - Automated vulnerability scanning
   - Dependency updates

## Security Monitoring

1. **Authentication Monitoring**:
   - Log all authentication events
   - Monitor for suspicious activity
   - Alert on multiple failed login attempts

2. **API Monitoring**:
   - Track API usage patterns
   - Monitor for abnormal request volumes
   - Log and alert on rate limit violations

3. **Database Monitoring**:
   - Audit sensitive data access
   - Monitor for unusual query patterns
   - Track schema and permission changes

## Incident Response

1. **Security Incident Procedure**:
   - Identify and contain the incident
   - Investigate the cause and impact
   - Remediate vulnerabilities
   - Notify affected users if required
   - Document lessons learned

2. **Contact Information**:
   - Security team: security@styleai.example.com
   - Emergency contact: +1-555-123-4567

## Security Roadmap

1. **Short-term (1-3 months)**:
   - Implement multi-factor authentication
   - Complete security testing suite
   - Set up Dependabot for automated security alerts

2. **Medium-term (3-6 months)**:
   - Implement security headers
   - Add advanced rate limiting
   - Enhance logging and monitoring

3. **Long-term (6-12 months)**:
   - Third-party security audit
   - Implement advanced threat detection
   - Obtain security certification
