/**
 * Base Repository
 * 
 * This class provides a foundation for all repository classes,
 * with common CRUD operations and error handling.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

export class BaseRepository<T, InsertT, UpdateT> {
  protected client: SupabaseClient<Database>;
  protected tableName: string;

  constructor(client: SupabaseClient<Database>, tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  /**
   * Get all records
   * @param userId Optional user ID to filter by
   * @returns Array of records
   */
  async getAll(userId?: string): Promise<T[]> {
    try {
      let query = this.client.from(this.tableName).select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`Error fetching ${this.tableName}:`, error);
        throw error;
      }
      
      return data as T[];
    } catch (error) {
      console.error(`Error in ${this.tableName} getAll:`, error);
      throw error;
    }
  }

  /**
   * Get a record by ID
   * @param id Record ID
   * @returns Record or null if not found
   */
  async getById(id: string): Promise<T | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found
          return null;
        }
        console.error(`Error fetching ${this.tableName} by ID:`, error);
        throw error;
      }
      
      return data as T;
    } catch (error) {
      console.error(`Error in ${this.tableName} getById:`, error);
      throw error;
    }
  }

  /**
   * Create a new record
   * @param data Record data
   * @returns Created record
   */
  async create(data: InsertT): Promise<T> {
    try {
      const { data: createdData, error } = await this.client
        .from(this.tableName)
        .insert(data as any)
        .select()
        .single();
      
      if (error) {
        console.error(`Error creating ${this.tableName}:`, error);
        throw error;
      }
      
      return createdData as T;
    } catch (error) {
      console.error(`Error in ${this.tableName} create:`, error);
      throw error;
    }
  }

  /**
   * Update a record
   * @param id Record ID
   * @param data Update data
   * @returns Updated record
   */
  async update(id: string, data: UpdateT): Promise<T> {
    try {
      const { data: updatedData, error } = await this.client
        .from(this.tableName)
        .update(data as any)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating ${this.tableName}:`, error);
        throw error;
      }
      
      return updatedData as T;
    } catch (error) {
      console.error(`Error in ${this.tableName} update:`, error);
      throw error;
    }
  }

  /**
   * Delete a record
   * @param id Record ID
   * @returns Success status
   */
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting ${this.tableName}:`, error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error(`Error in ${this.tableName} delete:`, error);
      throw error;
    }
  }
}
