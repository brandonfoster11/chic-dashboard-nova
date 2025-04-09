-- Create a function that allows executing SQL statements
-- This is used by our schema scripts to execute SQL statements
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Grant execute permission to authenticated users
-- Note: In production, you would restrict this to specific roles
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;
