/**
 * Database connectivity and status checking utilities
 */
import { supabase } from './supabase';

interface DbStatusResult {
  isConnected: boolean;
  hasPermissions: boolean;
  error?: string;
  details?: any;
}

/**
 * Check database connectivity and permissions
 * @returns Status information about the database connection
 */
export async function checkDatabaseStatus(): Promise<DbStatusResult> {
  try {
    console.log('Checking database connectivity...');
    
    // First check if we can connect at all
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Database connection error:', sessionError);
      return {
        isConnected: false,
        hasPermissions: false,
        error: sessionError.message,
        details: sessionError
      };
    }
    
    // Now check if we can query a simple table
    // This will test RLS policies
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('Database permission error:', testError);
      return {
        isConnected: true,
        hasPermissions: false,
        error: testError.message,
        details: testError
      };
    }
    
    return {
      isConnected: true,
      hasPermissions: true
    };
  } catch (error) {
    console.error('Unexpected error checking database status:', error);
    return {
      isConnected: false,
      hasPermissions: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
}

/**
 * Get a user-friendly message about database status
 * @param status The database status result
 * @returns A user-friendly message
 */
export function getDbStatusMessage(status: DbStatusResult): string {
  if (!status.isConnected) {
    return 'Cannot connect to the database. Please check your internet connection or try again later.';
  }
  
  if (!status.hasPermissions) {
    return 'Connected to the database, but you do not have permission to access the required data. Please use the test account or contact support.';
  }
  
  return 'Database connection is working properly.';
}
