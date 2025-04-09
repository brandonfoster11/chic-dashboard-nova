import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';

export class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Export all user data (CCPA compliance)
   * @returns JSON object containing all user data
   */
  async exportUserData(): Promise<{ data: any; error: Error | null }> {
    try {
      const { data: userData, error } = await supabase.rpc('export_user_data');
      
      if (error) throw error;
      
      // Format the data for download
      const formattedData = {
        userData,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      return { data: formattedData, error: null };
    } catch (error) {
      console.error('Error exporting user data:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('An unknown error occurred') 
      };
    }
  }

  /**
   * Delete user account and all associated data (CCPA compliance)
   * @returns Success status
   */
  async deleteUserAccount(): Promise<{ success: boolean; error: Error | null }> {
    try {
      // First, delete all user data from the database
      const { data: deleteResult, error: deleteError } = await supabase.rpc('delete_user_data');
      
      if (deleteError) throw deleteError;
      
      if (!deleteResult) {
        throw new Error('Failed to delete user data');
      }
      
      // Then, delete the user account from Supabase Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id as string
      );
      
      if (authError) throw authError;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting user account:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('An unknown error occurred') 
      };
    }
  }

  /**
   * Anonymize user data instead of full deletion
   * @returns Success status
   */
  async anonymizeUserData(): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { data: anonymizeResult, error } = await supabase.rpc('anonymize_user_data');
      
      if (error) throw error;
      
      if (!anonymizeResult) {
        throw new Error('Failed to anonymize user data');
      }
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error anonymizing user data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('An unknown error occurred') 
      };
    }
  }

  /**
   * Get user's MFA logs
   * @param limit Number of logs to return
   * @param offset Offset for pagination
   * @returns MFA logs
   */
  async getMfaLogs(limit = 10, offset = 0): Promise<{ data: any[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('mfa_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error getting MFA logs:', error);
      return { 
        data: [], 
        error: error instanceof Error ? error : new Error('An unknown error occurred') 
      };
    }
  }
}
