import { supabase } from '@/lib/supabase';

export const inspectDatabaseSchema = async () => {
  try {
    // Get all tables in public schema
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables')
      .select('*');

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      return { tables: [], policies: [], error: tablesError };
    }

    // Get RLS policies
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies')
      .select('*');

    if (policiesError) {
      console.error('Error fetching policies:', policiesError);
      return { tables: tables || [], policies: [], error: policiesError };
    }

    // Get table columns
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_columns')
      .select('*');

    if (columnsError) {
      console.error('Error fetching columns:', columnsError);
      return { 
        tables: tables || [], 
        policies: policies || [], 
        columns: [],
        error: columnsError 
      };
    }

    return {
      tables: tables || [],
      policies: policies || [],
      columns: columns || [],
      error: null
    };
  } catch (error) {
    console.error('Schema inspection failed:', error);
    return { tables: [], policies: [], columns: [], error };
  }
};
