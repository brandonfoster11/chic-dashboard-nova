/**
 * Wardrobe Repository
 * 
 * This class handles database operations for wardrobe items.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base-repository';
import { Database, WardrobeItem } from '../types/database';

export class WardrobeRepository extends BaseRepository<
  WardrobeItem,
  Omit<WardrobeItem, 'id' | 'created_at' | 'updated_at'>,
  Partial<Omit<WardrobeItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
> {
  constructor(client: SupabaseClient<Database>) {
    super(client, 'wardrobe_items');
  }

  /**
   * Get all wardrobe items for the current user
   * @returns Array of wardrobe items
   */
  async getCurrentUserItems(): Promise<WardrobeItem[]> {
    try {
      const { data: user } = await this.client.auth.getUser();
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error getting current user wardrobe items:', error);
        throw error;
      }
      
      return data as WardrobeItem[];
    } catch (error) {
      console.error('Error getting current user wardrobe items:', error);
      throw error;
    }
  }

  /**
   * Get wardrobe items by category
   * @param category Category to filter by
   * @param userId Optional user ID (defaults to current user)
   * @returns Array of wardrobe items
   */
  async getByCategory(category: string, userId?: string): Promise<WardrobeItem[]> {
    try {
      let actualUserId = userId;
      
      if (!actualUserId) {
        const { data: user } = await this.client.auth.getUser();
        if (!user.user) {
          throw new Error('User not authenticated');
        }
        actualUserId = user.user.id;
      }
      
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('user_id', actualUserId)
        .eq('category', category);
      
      if (error) {
        console.error('Error fetching wardrobe items by category:', error);
        throw error;
      }
      
      return data as WardrobeItem[];
    } catch (error) {
      console.error('Error in getByCategory:', error);
      throw error;
    }
  }

  /**
   * Get favorite wardrobe items
   * @param userId Optional user ID (defaults to current user)
   * @returns Array of favorite wardrobe items
   */
  async getFavorites(userId?: string): Promise<WardrobeItem[]> {
    try {
      let actualUserId = userId;
      
      if (!actualUserId) {
        const { data: user } = await this.client.auth.getUser();
        if (!user.user) {
          throw new Error('User not authenticated');
        }
        actualUserId = user.user.id;
      }
      
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('user_id', actualUserId)
        .eq('favorite', true);
      
      if (error) {
        console.error('Error fetching favorite wardrobe items:', error);
        throw error;
      }
      
      return data as WardrobeItem[];
    } catch (error) {
      console.error('Error in getFavorites:', error);
      throw error;
    }
  }

  /**
   * Create a wardrobe item for the current user
   * @param data Wardrobe item data
   * @returns Created wardrobe item
   */
  async createForCurrentUser(data: Omit<WardrobeItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<WardrobeItem> {
    try {
      const { data: user } = await this.client.auth.getUser();
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }
      
      const itemData = {
        ...data,
        user_id: user.user.id
      };
      
      return this.create(itemData as any);
    } catch (error) {
      console.error('Error creating wardrobe item for current user:', error);
      throw error;
    }
  }

  /**
   * Search wardrobe items by tags
   * @param tags Tags to search for
   * @param userId Optional user ID (defaults to current user)
   * @returns Array of matching wardrobe items
   */
  async searchByTags(tags: string[], userId?: string): Promise<WardrobeItem[]> {
    try {
      let actualUserId = userId;
      
      if (!actualUserId) {
        const { data: user } = await this.client.auth.getUser();
        if (!user.user) {
          throw new Error('User not authenticated');
        }
        actualUserId = user.user.id;
      }
      
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('user_id', actualUserId)
        .contains('tags', tags);
      
      if (error) {
        console.error('Error searching wardrobe items by tags:', error);
        throw error;
      }
      
      return data as WardrobeItem[];
    } catch (error) {
      console.error('Error in searchByTags:', error);
      throw error;
    }
  }
}
