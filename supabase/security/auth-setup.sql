-- StyleAI Security Enhancement: Authentication & MFA
-- This script sets up the necessary tables and policies for enhanced authentication

-- Create MFA logs table to track authentication events
CREATE TABLE IF NOT EXISTS mfa_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  event_type TEXT NOT NULL, -- 'login', 'logout', 'mfa_request', 'mfa_success', 'mfa_failure'
  ip_address TEXT,
  user_agent TEXT,
  device_fingerprint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on MFA logs
ALTER TABLE mfa_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own MFA logs
DO $$ BEGIN
  CREATE POLICY "Users can view their own MFA logs"
  ON mfa_logs FOR SELECT
  USING (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Only the system can insert MFA logs (via service role)
DO $$ BEGIN
  CREATE POLICY "System can insert MFA logs"
  ON mfa_logs FOR INSERT
  WITH CHECK (true); -- This will be restricted by using the service role for inserts
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can view all MFA logs
DO $$ BEGIN
  CREATE POLICY "Admins can view all MFA logs"
  ON mfa_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create a function to log MFA events
CREATE OR REPLACE FUNCTION log_mfa_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_device_fingerprint TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO mfa_logs (
    user_id,
    event_type,
    ip_address,
    user_agent,
    device_fingerprint
  ) VALUES (
    p_user_id,
    p_event_type,
    p_ip_address,
    p_user_agent,
    p_device_fingerprint
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Create a trigger to log authentication events
CREATE OR REPLACE FUNCTION handle_auth_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log sign-in events
  IF TG_OP = 'INSERT' THEN
    PERFORM log_mfa_event(
      NEW.id,
      'login',
      NEW.ip::TEXT,
      NULL, -- user_agent not available in auth.sessions
      NULL  -- device_fingerprint would need to be added separately
    );
  -- Log sign-out events
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_mfa_event(
      OLD.id,
      'logout',
      OLD.ip::TEXT,
      NULL,
      NULL
    );
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create triggers for auth events
DROP TRIGGER IF EXISTS on_auth_sign_in ON auth.sessions;
CREATE TRIGGER on_auth_sign_in
  AFTER INSERT ON auth.sessions
  FOR EACH ROW EXECUTE FUNCTION handle_auth_event();

DROP TRIGGER IF EXISTS on_auth_sign_out ON auth.sessions;
CREATE TRIGGER on_auth_sign_out
  AFTER DELETE ON auth.sessions
  FOR EACH ROW EXECUTE FUNCTION handle_auth_event();
