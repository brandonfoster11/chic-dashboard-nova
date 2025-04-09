/**
 * Profile Repository
 * 
 * This class handles database operations for user profiles.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base-repository';
import { Database, Profile } from '../types/database';

export class ProfileRepository extends BaseRepository<
  Profile,
  Omit<Profile, 'created_at' | 'updated_at'>,
  Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
> {
  constructor(client: SupabaseClient<Database>) {
    super(client, 'profiles');
  }

  /**
   * Get the current user's profile
   * @returns The current user's profile or null if not found
   */
  async getCurrentProfile(): Promise<Profile | null> {
    try {
      const { data: user } = await this.client.auth.getUser();
      
      if (!user.user) {
        return null;
      }
      
      return this.getById(user.user.id);
    } catch (error) {
      console.error('Error getting current profile:', error);
      throw error;
    }
  }

  /**
   * Get a profile by username
   * @param username Username to search for
   * @returns Profile or null if not found
   */
  async getByUsername(username: string): Promise<Profile | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Profile not found
          return null;
        }
        console.error('Error fetching profile by username:', error);
        throw error;
      }
      
      return data as Profile;
    } catch (error) {
      console.error('Error in getByUsername:', error);
      throw error;
    }
  }

  /**
   * Update the current user's profile
   * @param data Profile data to update
   * @returns Updated profile
   */
  async updateCurrentProfile(data: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>): Promise<Profile> {
    try {
      const { data: user } = await this.client.auth.getUser();
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }
      
      return this.update(user.user.id, data);
    } catch (error) {
      console.error('Error updating current profile:', error);
      throw error;
    }
  }
}
