/**
 * Database Connection Test
 * 
 * This utility tests the connection to Supabase and verifies database access.
 */

import { supabase } from '../lib/supabase';
import { RepositoryFactory } from '../repositories/repository-factory';

export async function testDatabaseConnection() {
  try {
    // Test basic connection
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Auth error:', authError);
      return false;
    }
    
    console.log('Authenticated user:', user?.email);

    // Test database access
    const profileRepo = RepositoryFactory.getInstance(supabase).getProfileRepository();
    const profiles = await profileRepo.getAll();
    console.log('Retrieved profiles:', profiles.length);

    // Test schema inspection
    const { data: tables, error: tablesError } = await supabase.rpc('get_tables');
    if (tablesError) {
      console.error('Error getting tables:', tablesError);
      return false;
    }
    
    console.log('Database tables:', tables.map(t => t.table_name));

    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}
