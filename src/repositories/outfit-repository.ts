/**
 * Outfit Repository
 * 
 * This class handles database operations for outfits.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base-repository';
import { Database, Outfit, OutfitItem, WardrobeItem } from '../types/database';

export class OutfitRepository extends BaseRepository<
  Outfit,
  Omit<Outfit, 'id' | 'created_at' | 'updated_at'>,
  Partial<Omit<Outfit, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
> {
  constructor(client: SupabaseClient<Database>) {
    super(client, 'outfits');
  }

  /**
   * Get all outfits for the current user
   * @returns Array of outfits
   */
  async getCurrentUserOutfits(): Promise<Outfit[]> {
    try {
      const { data: user } = await this.client.auth.getUser();
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }
      
      return this.getAll(user.user.id);
    } catch (error) {
      console.error('Error getting current user outfits:', error);
      throw error;
    }
  }

  /**
   * Get outfits by occasion
   * @param occasion Occasion to filter by
   * @param userId Optional user ID (defaults to current user)
   * @returns Array of outfits
   */
  async getByOccasion(occasion: string, userId?: string): Promise<Outfit[]> {
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
        .eq('occasion', occasion);
      
      if (error) {
        console.error('Error fetching outfits by occasion:', error);
        throw error;
      }
      
      return data as Outfit[];
    } catch (error) {
      console.error('Error in getByOccasion:', error);
      throw error;
    }
  }

  /**
   * Get outfits by season
   * @param season Season to filter by
   * @param userId Optional user ID (defaults to current user)
   * @returns Array of outfits
   */
  async getBySeason(season: string, userId?: string): Promise<Outfit[]> {
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
        .eq('season', season);
      
      if (error) {
        console.error('Error fetching outfits by season:', error);
        throw error;
      }
      
      return data as Outfit[];
    } catch (error) {
      console.error('Error in getBySeason:', error);
      throw error;
    }
  }

  /**
   * Get favorite outfits
   * @param userId Optional user ID (defaults to current user)
   * @returns Array of favorite outfits
   */
  async getFavorites(userId?: string): Promise<Outfit[]> {
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
        .eq('is_favorite', true);
      
      if (error) {
        console.error('Error fetching favorite outfits:', error);
        throw error;
      }
      
      return data as Outfit[];
    } catch (error) {
      console.error('Error in getFavorites:', error);
      throw error;
    }
  }

  /**
   * Create an outfit for the current user
   * @param data Outfit data
   * @returns Created outfit
   */
  async createForCurrentUser(data: Omit<Outfit, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Outfit> {
    try {
      const { data: user } = await this.client.auth.getUser();
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }
      
      const outfitData = {
        ...data,
        user_id: user.user.id
      };
      
      return this.create(outfitData as any);
    } catch (error) {
      console.error('Error creating outfit for current user:', error);
      throw error;
    }
  }

  /**
   * Get outfit with items
   * @param outfitId Outfit ID
   * @returns Outfit with items
   */
  async getOutfitWithItems(outfitId: string): Promise<{ outfit: Outfit, items: WardrobeItem[] }> {
    try {
      // Get the outfit
      const outfit = await this.getById(outfitId);
      
      if (!outfit) {
        throw new Error(`Outfit with ID ${outfitId} not found`);
      }
      
      // Get the outfit items
      const { data: outfitItems, error: outfitItemsError } = await this.client
        .from('outfit_items')
        .select('*')
        .eq('outfit_id', outfitId)
        .order('position');
      
      if (outfitItemsError) {
        console.error('Error fetching outfit items:', outfitItemsError);
        throw outfitItemsError;
      }
      
      if (!outfitItems || outfitItems.length === 0) {
        return { outfit, items: [] };
      }
      
      // Get the wardrobe items
      const itemIds = outfitItems.map(item => item.item_id);
      const { data: wardrobeItems, error: wardrobeItemsError } = await this.client
        .from('wardrobe_items')
        .select('*')
        .in('id', itemIds);
      
      if (wardrobeItemsError) {
        console.error('Error fetching wardrobe items:', wardrobeItemsError);
        throw wardrobeItemsError;
      }
      
      // Sort items by position
      const sortedItems = outfitItems.map(outfitItem => {
        const item = wardrobeItems.find(wardrobeItem => wardrobeItem.id === outfitItem.item_id);
        return item;
      }).filter(Boolean) as WardrobeItem[];
      
      return { outfit, items: sortedItems };
    } catch (error) {
      console.error('Error in getOutfitWithItems:', error);
      throw error;
    }
  }

  /**
   * Add items to an outfit
   * @param outfitId Outfit ID
   * @param itemIds Array of wardrobe item IDs
   * @returns Success status
   */
  async addItemsToOutfit(outfitId: string, itemIds: string[]): Promise<boolean> {
    try {
      // Get the outfit to verify it exists and the user has access
      const outfit = await this.getById(outfitId);
      
      if (!outfit) {
        throw new Error(`Outfit with ID ${outfitId} not found`);
      }
      
      // Get the current max position
      const { data: currentItems, error: currentItemsError } = await this.client
        .from('outfit_items')
        .select('position')
        .eq('outfit_id', outfitId)
        .order('position', { ascending: false })
        .limit(1);
      
      if (currentItemsError) {
        console.error('Error fetching current outfit items:', currentItemsError);
        throw currentItemsError;
      }
      
      let startPosition = 0;
      if (currentItems && currentItems.length > 0) {
        startPosition = currentItems[0].position + 1;
      }
      
      // Prepare the items to add
      const itemsToAdd = itemIds.map((itemId, index) => ({
        outfit_id: outfitId,
        item_id: itemId,
        position: startPosition + index
      }));
      
      // Add the items
      const { error } = await this.client
        .from('outfit_items')
        .insert(itemsToAdd);
      
      if (error) {
        console.error('Error adding items to outfit:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in addItemsToOutfit:', error);
      throw error;
    }
  }

  /**
   * Remove an item from an outfit
   * @param outfitId Outfit ID
   * @param itemId Wardrobe item ID
   * @returns Success status
   */
  async removeItemFromOutfit(outfitId: string, itemId: string): Promise<boolean> {
    try {
      const { error } = await this.client
        .from('outfit_items')
        .delete()
        .eq('outfit_id', outfitId)
        .eq('item_id', itemId);
      
      if (error) {
        console.error('Error removing item from outfit:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in removeItemFromOutfit:', error);
      throw error;
    }
  }

  /**
   * Update item positions in an outfit
   * @param outfitId Outfit ID
   * @param itemPositions Array of item IDs and positions
   * @returns Success status
   */
  async updateItemPositions(outfitId: string, itemPositions: { itemId: string, position: number }[]): Promise<boolean> {
    try {
      // Start a transaction
      const updates = itemPositions.map(({ itemId, position }) => {
        return this.client
          .from('outfit_items')
          .update({ position })
          .eq('outfit_id', outfitId)
          .eq('item_id', itemId);
      });
      
      // Execute all updates
      await Promise.all(updates);
      
      return true;
    } catch (error) {
      console.error('Error in updateItemPositions:', error);
      throw error;
    }
  }
}
