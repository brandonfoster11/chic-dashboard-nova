import { WardrobeFilters, WardrobeItem, WardrobeService as IWardrobeService, WardrobeStats, WardrobeCategory } from './types';
import { validateData } from '@/lib/middleware/validation';
import { createWardrobeItemSchema, updateWardrobeItemSchema } from '@/lib/validations/wardrobe';
import { mockWardrobeItems } from './wardrobe.service.mock';
import { toast } from '@/components/ui/use-toast';

// Helper function to convert data types between interfaces
const convertDataItem = (item: any): WardrobeItem => {
  return {
    id: item.id,
    name: item.name,
    type: item.type,
    color: item.color,
    imageUrl: item.image_url,
    description: item.description || '',
    brand: item.brand || '',
    tags: item.tags || [],
    favorite: item.favorite || false,
    wearCount: item.wear_count || 0,
    dateAdded: item.created_at,
    lastWorn: item.last_worn
  };
};

export class WardrobeService implements IWardrobeService {
  async getWardrobeItems(filters?: WardrobeFilters): Promise<WardrobeItem[]> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let items = [...mockWardrobeItems];
      
      // Apply filters if provided
      if (filters) {
        if (filters.type && filters.type.length > 0) {
          items = items.filter(item => filters.type?.includes(item.type));
        }
        if (filters.color && filters.color.length > 0) {
          items = items.filter(item => filters.color?.includes(item.color));
        }
        if (filters.brand && filters.brand.length > 0) {
          items = items.filter(item => item.brand && filters.brand?.includes(item.brand));
        }
        if (filters.tags && filters.tags.length > 0) {
          items = items.filter(item => 
            item.tags && filters.tags?.some(tag => item.tags.includes(tag))
          );
        }
        if (filters.favorite !== undefined) {
          items = items.filter(item => item.favorite === filters.favorite);
        }
        if (filters.search) {
          const search = filters.search.toLowerCase();
          items = items.filter(item => 
            item.name.toLowerCase().includes(search) || 
            (item.description && item.description.toLowerCase().includes(search)) ||
            (item.brand && item.brand.toLowerCase().includes(search))
          );
        }
      }
      
      return items.map(convertDataItem);
    } catch (error) {
      console.error('Error fetching wardrobe items:', error);
      return [];
    }
  }

  async getWardrobeItem(id: string): Promise<WardrobeItem> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const item = mockWardrobeItems.find(item => item.id === id);
      
      if (!item) {
        throw new Error(`Wardrobe item with id ${id} not found`);
      }
      
      return convertDataItem(item);
    } catch (error) {
      console.error('Error fetching wardrobe item:', error);
      throw new Error(`Failed to fetch wardrobe item with id ${id}`);
    }
  }

  async addWardrobeItem(item: Omit<WardrobeItem, 'id'>): Promise<WardrobeItem> {
    try {
      // Validate the data
      validateData(createWardrobeItemSchema, {
        name: item.name,
        type: item.type,
        color: item.color,
        image_url: item.imageUrl,
        description: item.description,
        brand: item.brand,
        tags: item.tags,
        favorite: item.favorite || false
      });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a new item with a mock ID
      const newItem = {
        id: `wardrobe-item-${Date.now()}`,
        user_id: 'mock-user-id',
        name: item.name,
        type: item.type as any,
        color: item.color,
        image_url: item.imageUrl,
        description: item.description,
        brand: item.brand,
        tags: item.tags || [],
        favorite: item.favorite || false,
        wear_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_worn: undefined
      };
      
      // Add to mock data
      mockWardrobeItems.unshift(newItem);
      
      // Show success toast
      toast({
        title: "Item Added",
        description: `${item.name} has been added to your wardrobe.`,
      });
      
      return convertDataItem(newItem);
    } catch (error) {
      console.error('Error adding wardrobe item:', error);
      toast({
        title: "Error",
        description: `Failed to add item: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
      throw error;
    }
  }

  async updateWardrobeItem(id: string, updates: Partial<WardrobeItem>): Promise<WardrobeItem> {
    try {
      // Validate the data
      validateData(updateWardrobeItemSchema, {
        id,
        ...updates,
        // Map imageUrl to image_url for validation
        ...(updates.imageUrl && { image_url: updates.imageUrl })
      });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Find the item to update
      const itemIndex = mockWardrobeItems.findIndex(item => item.id === id);
      
      if (itemIndex === -1) {
        throw new Error(`Wardrobe item with id ${id} not found`);
      }
      
      // Update the item
      const updatedItem = {
        ...mockWardrobeItems[itemIndex],
        name: updates.name || mockWardrobeItems[itemIndex].name,
        type: (updates.type as any) || mockWardrobeItems[itemIndex].type,
        color: updates.color || mockWardrobeItems[itemIndex].color,
        image_url: updates.imageUrl || mockWardrobeItems[itemIndex].image_url,
        description: updates.description !== undefined ? updates.description : mockWardrobeItems[itemIndex].description,
        brand: updates.brand !== undefined ? updates.brand : mockWardrobeItems[itemIndex].brand,
        tags: updates.tags || mockWardrobeItems[itemIndex].tags,
        favorite: updates.favorite !== undefined ? updates.favorite : mockWardrobeItems[itemIndex].favorite,
        updated_at: new Date().toISOString()
      };
      
      // Update in mock data
      mockWardrobeItems[itemIndex] = updatedItem;
      
      // Show success toast
      toast({
        title: "Item Updated",
        description: `${updatedItem.name} has been updated.`,
      });
      
      return convertDataItem(updatedItem);
    } catch (error) {
      console.error('Error updating wardrobe item:', error);
      toast({
        title: "Error",
        description: `Failed to update item: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
      throw error;
    }
  }

  async removeWardrobeItem(id: string): Promise<void> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the item to remove
      const itemIndex = mockWardrobeItems.findIndex(item => item.id === id);
      
      if (itemIndex === -1) {
        throw new Error(`Wardrobe item with id ${id} not found`);
      }
      
      const itemName = mockWardrobeItems[itemIndex].name;
      
      // Remove from mock data
      mockWardrobeItems.splice(itemIndex, 1);
      
      // Show success toast
      toast({
        title: "Item Removed",
        description: `${itemName} has been removed from your wardrobe.`,
      });
    } catch (error) {
      console.error('Error removing wardrobe item:', error);
      toast({
        title: "Error",
        description: `Failed to remove item: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
      throw error;
    }
  }

  async getWardrobeStats(): Promise<WardrobeStats> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const items = await this.getWardrobeItems();
      
      // Calculate categories
      const categoriesMap = new Map<string, number>();
      items.forEach(item => {
        const count = categoriesMap.get(item.type) || 0;
        categoriesMap.set(item.type, count + 1);
      });
      
      const categories: WardrobeCategory[] = Array.from(categoriesMap.entries()).map(([name, count]) => ({
        id: name,
        name,
        count
      }));
      
      // Find most worn item
      const mostWorn = items.length > 0 
        ? items.reduce((prev, current) => 
            (prev.wearCount > current.wearCount) ? prev : current
          )
        : null;
      
      // Get recently added items (top 5)
      const recentlyAdded = [...items]
        .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        .slice(0, 5);
      
      // Get favorite items
      const favorites = items.filter(item => item.favorite);
      
      return {
        totalItems: items.length,
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
      // Get the current item
      const item = await this.getWardrobeItem(id);
      
      // Toggle the favorite status
      const updatedItem = await this.updateWardrobeItem(id, { 
        favorite: !item.favorite 
      });
      
      // Show success toast
      toast({
        title: item.favorite ? "Removed from Favorites" : "Added to Favorites",
        description: `${item.name} has been ${item.favorite ? "removed from" : "added to"} your favorites.`,
      });
      
      return updatedItem;
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      toast({
        title: "Error",
        description: `Failed to update favorite status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
      throw error;
    }
  }

  async incrementWearCount(id: string): Promise<WardrobeItem> {
    try {
      // Get the current item
      const item = await this.getWardrobeItem(id);
      
      // Increment the wear count and update last worn date
      const updatedItem = await this.updateWardrobeItem(id, { 
        wearCount: (item.wearCount || 0) + 1,
        lastWorn: new Date().toISOString()
      });
      
      // Show success toast
      toast({
        title: "Wear Count Updated",
        description: `${item.name} wear count increased to ${(item.wearCount || 0) + 1}.`,
      });
      
      return updatedItem;
    } catch (error) {
      console.error('Error incrementing wear count:', error);
      toast({
        title: "Error",
        description: `Failed to update wear count: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
      throw error;
    }
  }
}
