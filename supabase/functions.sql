-- Schema inspection functions

-- Function to get all tables in the public schema
CREATE OR REPLACE FUNCTION public.get_tables()
RETURNS TABLE (
  table_name text,
  table_type text,
  estimated_row_count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.tablename::text as table_name,
    CASE 
      WHEN t.tablename ~ '^_' THEN 'Internal'
      ELSE 'User'
    END as table_type,
    COALESCE(s.n_live_tup, 0)::bigint as estimated_row_count
  FROM 
    pg_catalog.pg_tables t
  LEFT JOIN 
    pg_stat_user_tables s ON t.tablename = s.relname
  WHERE 
    t.schemaname = 'public'
  ORDER BY 
    t.tablename;
END;
$$;

-- Function to get RLS policies
CREATE OR REPLACE FUNCTION public.get_policies()
RETURNS TABLE (
  table_name text,
  policy_name text,
  command text,
  roles text[],
  using_expression text,
  with_check_expression text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.tablename::text as table_name,
    p.policyname::text as policy_name,
    p.cmd::text as command,
    p.roles as roles,
    p.qual::text as using_expression,
    p.with_check::text as with_check_expression
  FROM
    pg_policies p
  WHERE
    p.schemaname = 'public'
  ORDER BY
    p.tablename, p.policyname;
END;
$$;

-- Function to get column information
CREATE OR REPLACE FUNCTION public.get_columns()
RETURNS TABLE (
  table_name text,
  column_name text,
  data_type text,
  is_nullable boolean,
  column_default text,
  is_identity boolean
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.table_name::text,
    c.column_name::text,
    c.data_type::text,
    c.is_nullable = 'YES' as is_nullable,
    c.column_default::text,
    c.is_identity = 'YES' as is_identity
  FROM
    information_schema.columns c
  WHERE
    c.table_schema = 'public'
  ORDER BY
    c.table_name, c.ordinal_position;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_tables() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_policies() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_columns() TO authenticated;
