import { supabase } from '@/utils/supabase';
import { WardrobeFilters, WardrobeItem, WardrobeService as IWardrobeService, WardrobeStats } from './types';
import { validateData } from '@/lib/middleware/validation';
import { createWardrobeItemSchema, updateWardrobeItemSchema } from '@/lib/validations/wardrobe';

export interface CreateWardrobeItemDTO {
  name: string;
  type: string;
  color: string;
  imageUrl?: string;
  description?: string;
  brand?: string;
  tags?: string[];
  favorite?: boolean;
}

export class WardrobeService implements IWardrobeService {
  private static instance: WardrobeService;

  private constructor() {}

  public static getInstance(): WardrobeService {
    if (!WardrobeService.instance) {
      WardrobeService.instance = new WardrobeService();
    }
    return WardrobeService.instance;
  }

  async getWardrobeItems(filters?: WardrobeFilters): Promise<WardrobeItem[]> {
    try {
      let query = supabase
        .from('wardrobe_items')
        .select('*');

      // Apply filters if provided
      if (filters) {
        if (filters.type && filters.type.length > 0) {
          query = query.in('type', filters.type);
        }
        if (filters.color && filters.color.length > 0) {
          query = query.in('color', filters.color);
        }
        if (filters.brand && filters.brand.length > 0) {
          query = query.in('brand', filters.brand);
        }
        if (filters.tags && filters.tags.length > 0) {
          // For tags, we need to check if any of the tags in the array match
          // This assumes tags are stored as an array in Supabase
          query = query.contains('tags', filters.tags);
        }
        if (filters.favorite !== undefined) {
          query = query.eq('favorite', filters.favorite);
        }
        if (filters.search) {
          query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return data as WardrobeItem[];
    } catch (error) {
      console.error('Error fetching wardrobe items:', error);
      return [];
    }
  }

  async getWardrobeItem(id: string): Promise<WardrobeItem> {
    try {
      const { data, error } = await supabase
        .from('wardrobe_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data as WardrobeItem;
    } catch (error) {
      console.error('Error fetching wardrobe item:', error);
      throw new Error(`Failed to fetch wardrobe item with id ${id}`);
    }
  }

  async addWardrobeItem(item: CreateWardrobeItemDTO): Promise<WardrobeItem | null> {
    try {
      // Validate and sanitize input data
      const validationResult = validateData(createWardrobeItemSchema, {
        name: item.name,
        category: item.type, // Map type to category for validation
        color: item.color,
        image_url: item.imageUrl,
        description: item.description,
        brand: item.brand,
        tags: item.tags,
        favorite: item.favorite || false
      });

      // If validation fails, return null
      if (!validationResult.success) {
        console.error('Validation failed:', validationResult.errors);
        return null;
      }

      // Use the validated and sanitized data
      const validatedData = validationResult.data;
      
      const { data, error } = await supabase
        .from('wardrobe_items')
        .insert({
          name: validatedData.name,
          type: validatedData.category, // Map category back to type
          color: validatedData.color,
          image_url: validatedData.image_url,
          description: validatedData.description,
          brand: validatedData.brand,
          tags: validatedData.tags || [],
          favorite: validatedData.favorite || false,
          dateAdded: new Date().toISOString(),
          wearCount: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding wardrobe item:', error);
        return null;
      }

      return data as WardrobeItem;
    } catch (error) {
      console.error('Error adding wardrobe item:', error);
      return null;
    }
  }

  async updateWardrobeItem(id: string, updates: Partial<WardrobeItem>): Promise<WardrobeItem | null> {
    try {
      // Validate and sanitize input data
      const validationResult = validateData(updateWardrobeItemSchema, {
        id,
        ...updates,
        // Map type to category for validation if it exists
        ...(updates.type && { category: updates.type })
      });

      // If validation fails, return null
      if (!validationResult.success) {
        console.error('Validation failed:', validationResult.errors);
        return null;
      }

      // Use the validated and sanitized data
      const validatedData = validationResult.data;
      
      // Prepare update data, mapping category back to type if needed
      const updateData = {
        ...validatedData,
        ...(validatedData.category && { type: validatedData.category }),
        // Use the correct property name based on the WardrobeItem interface
        lastModified: new Date().toISOString()
      };
      
      // Remove category from update data to avoid DB schema conflicts
      if ('category' in updateData) {
        delete updateData.category;
      }

      const { data, error } = await supabase
        .from('wardrobe_items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating wardrobe item:', error);
        return null;
      }

      return data as WardrobeItem;
    } catch (error) {
      console.error('Error updating wardrobe item:', error);
      return null;
    }
  }

  async removeWardrobeItem(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('wardrobe_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing wardrobe item:', error);
      throw new Error(`Failed to remove wardrobe item with id ${id}`);
    }
  }

  async getWardrobeStats(): Promise<WardrobeStats> {
    try {
      // Get all wardrobe items
      const { data: items, error } = await supabase
        .from('wardrobe_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const wardrobeItems = items as WardrobeItem[];

      // Calculate categories
      const categoriesMap = new Map<string, number>();
      wardrobeItems.forEach(item => {
        const count = categoriesMap.get(item.type) || 0;
        categoriesMap.set(item.type, count + 1);
      });

      const categories = Array.from(categoriesMap.entries()).map(([name, count]) => ({
        id: name,
        name,
        count
      }));

      // Find most worn item
      const mostWorn = wardrobeItems.length > 0 
        ? wardrobeItems.reduce((prev, current) => 
            (prev.wearCount > current.wearCount) ? prev : current
          )
        : null;

      // Get recently added items (top 5)
      const recentlyAdded = wardrobeItems
        .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        .slice(0, 5);

      // Get favorite items
      const favorites = wardrobeItems.filter(item => item.favorite);

      return {
        totalItems: wardrobeItems.length,
        categories,
        mostWorn,
        recentlyAdded,
        favorites
      };
    } catch (error) {
      console.error('Error fetching wardrobe stats:', error);
      return {
        totalItems: 0,
        categories: [],
        mostWorn: null,
        recentlyAdded: [],
        favorites: []
      };
    }
  }

  async toggleFavorite(id: string): Promise<WardrobeItem> {
    try {
      // First get the current item to check its favorite status
      const { data: currentItem, error: fetchError } = await supabase
        .from('wardrobe_items')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Toggle the favorite status
      const { data, error } = await supabase
        .from('wardrobe_items')
        .update({ favorite: !currentItem.favorite })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data as WardrobeItem;
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      throw new Error(`Failed to toggle favorite status for item with id ${id}`);
    }
  }

  async incrementWearCount(id: string): Promise<WardrobeItem> {
    try {
      // First get the current item to get its wear count
      const { data: currentItem, error: fetchError } = await supabase
        .from('wardrobe_items')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Increment the wear count and update last worn date
      const { data, error } = await supabase
        .from('wardrobe_items')
        .update({ 
          wearCount: (currentItem.wearCount || 0) + 1,
          lastWorn: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data as WardrobeItem;
    } catch (error) {
      console.error('Error incrementing wear count:', error);
      throw new Error(`Failed to increment wear count for item with id ${id}`);
    }
  }
}
