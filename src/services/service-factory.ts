/**
 * Service Factory
 * 
 * This module provides a central place to import all services
 * and conditionally use either the real or mock implementations
 * based on the USE_MOCKS flag.
 */
import { USE_MOCKS } from '@/constants';
import { WardrobeItem as WardrobeServiceItem, WardrobeStats, WardrobeCategory, WardrobeFilters } from './wardrobe/types';
import { WardrobeItem as DataProviderWardrobeItem, ItemType } from './data/types';

// Import real services
import { WardrobeService as RealWardrobeService } from './wardrobe/wardrobe.service';
import { OutfitService as RealOutfitService } from './outfit/outfit.service';

// Import mock services
import * as MockWardrobeService from './wardrobe/wardrobe.service.mock';
import * as MockOutfitService from './outfit/outfit.service.mock';

// Type conversion helpers
const convertToServiceWardrobeItem = (item: DataProviderWardrobeItem): WardrobeServiceItem => {
  return {
    id: item.id,
    name: item.name,
    type: item.type as any, // Convert between the slightly different type enums
    imageUrl: item.image_url,
    color: item.color,
    brand: item.tags.find(tag => tag.includes('brand:')),
    description: item.tags.find(tag => tag.includes('desc:')),
    dateAdded: item.created_at,
    favorite: item.tags.includes('favorite'),
    tags: item.tags.filter(tag => !tag.includes('brand:') && !tag.includes('desc:')),
    wearCount: parseInt(item.tags.find(tag => tag.includes('wearCount:'))?.split(':')[1] || '0'),
    lastWorn: item.tags.find(tag => tag.includes('lastWorn:'))?.split(':')[1]
  };
};

const convertToDataProviderWardrobeItem = (item: Partial<WardrobeServiceItem> & { id?: string }): Partial<DataProviderWardrobeItem> => {
  const result: Partial<DataProviderWardrobeItem> = {
    name: item.name,
    type: item.type as ItemType,
    color: item.color,
    image_url: item.imageUrl,
  };
  
  if (item.id) {
    result.id = item.id;
  }
  
  // Handle tags conversion
  const tags: string[] = [...(item.tags || [])];
  
  if (item.brand) {
    tags.push(`brand:${item.brand}`);
  }
  
  if (item.description) {
    tags.push(`desc:${item.description}`);
  }
  
  if (item.favorite) {
    tags.push('favorite');
  }
  
  if (item.wearCount !== undefined) {
    tags.push(`wearCount:${item.wearCount}`);
  }
  
  if (item.lastWorn) {
    tags.push(`lastWorn:${item.lastWorn}`);
  }
  
  if (tags.length > 0) {
    result.tags = tags;
  }
  
  return result;
};

// Create instances of services
const createWardrobeService = () => {
  if (USE_MOCKS) {
    // Return the mock implementation functions with proper type conversions
    return {
      getWardrobeItems: async (filters?: WardrobeFilters): Promise<WardrobeServiceItem[]> => {
        const items = await MockWardrobeService.getWardrobeItems();
        return items.map(convertToServiceWardrobeItem);
      },
      getWardrobeItem: async (id: string): Promise<WardrobeServiceItem> => {
        const item = await MockWardrobeService.getWardrobeItem(id);
        if (!item) throw new Error('Item not found');
        return convertToServiceWardrobeItem(item);
      },
      addWardrobeItem: async (item: Omit<WardrobeServiceItem, 'id'>): Promise<WardrobeServiceItem> => {
        const dataProviderItem = convertToDataProviderWardrobeItem(item);
        const createdItem = await MockWardrobeService.createWardrobeItem(dataProviderItem as any);
        return convertToServiceWardrobeItem(createdItem);
      },
      updateWardrobeItem: async (id: string, updates: Partial<WardrobeServiceItem>): Promise<WardrobeServiceItem> => {
        const dataProviderUpdates = convertToDataProviderWardrobeItem(updates);
        const updatedItem = await MockWardrobeService.updateWardrobeItem(id, dataProviderUpdates);
        return convertToServiceWardrobeItem(updatedItem);
      },
      removeWardrobeItem: async (id: string): Promise<void> => {
        await MockWardrobeService.deleteWardrobeItem(id);
      },
      getWardrobeStats: async (): Promise<WardrobeStats> => {
        // Create a simple mock stats object
        const items = await MockWardrobeService.getWardrobeItems();
        const serviceItems = items.map(convertToServiceWardrobeItem);
        const categories: WardrobeCategory[] = [];
        
        // Count items by type
        const typeCount = new Map<string, number>();
        serviceItems.forEach(item => {
          const count = typeCount.get(item.type) || 0;
          typeCount.set(item.type, count + 1);
        });
        
        // Convert to categories
        typeCount.forEach((count, type) => {
          categories.push({
            id: type,
            name: type.charAt(0).toUpperCase() + type.slice(1),
            count
          });
        });
        
        return {
          totalItems: items.length,
          categories,
          mostWorn: serviceItems.length > 0 ? serviceItems.reduce((prev, current) => 
            (prev.wearCount > current.wearCount) ? prev : current) : null,
          recentlyAdded: serviceItems
            .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
            .slice(0, 3),
          favorites: serviceItems.filter(item => item.favorite).slice(0, 3)
        };
      },
      toggleFavorite: async (id: string): Promise<WardrobeServiceItem> => {
        // Get the current item
        const item = await MockWardrobeService.getWardrobeItem(id);
        if (!item) throw new Error('Item not found');
        
        // Convert to service item
        const serviceItem = convertToServiceWardrobeItem(item);
        
        // Toggle favorite status
        const updatedServiceItem = {
          ...serviceItem,
          favorite: !serviceItem.favorite
        };
        
        // Convert back to data provider item and update
        const dataProviderUpdates = convertToDataProviderWardrobeItem(updatedServiceItem);
        const updatedItem = await MockWardrobeService.updateWardrobeItem(id, dataProviderUpdates);
        
        return convertToServiceWardrobeItem(updatedItem);
      },
      incrementWearCount: async (id: string): Promise<WardrobeServiceItem> => {
        // Get the current item
        const item = await MockWardrobeService.getWardrobeItem(id);
        if (!item) throw new Error('Item not found');
        
        // Convert to service item
        const serviceItem = convertToServiceWardrobeItem(item);
        
        // Increment wear count
        const updatedServiceItem = {
          ...serviceItem,
          wearCount: (serviceItem.wearCount || 0) + 1,
          lastWorn: new Date().toISOString()
        };
        
        // Convert back to data provider item and update
        const dataProviderUpdates = convertToDataProviderWardrobeItem(updatedServiceItem);
        const updatedItem = await MockWardrobeService.updateWardrobeItem(id, dataProviderUpdates);
        
        return convertToServiceWardrobeItem(updatedItem);
      }
    };
  } else {
    // Return the real service instance
    return new RealWardrobeService();
  }
};

// For the outfit service, we need to create a proper factory as well
const createOutfitService = () => {
  if (USE_MOCKS) {
    // Return a mock outfit service with the expected interface
    return {
      generateOutfit: MockOutfitService.generateOutfit,
      saveOutfit: async (outfit: any) => {
        // Use the createOutfit method from the mock service
        return MockOutfitService.createOutfit(outfit);
      },
      getUserOutfits: async () => {
        // Use the getOutfits method from the mock service
        return MockOutfitService.getOutfits();
      }
    };
  } else {
    // For the real implementation, use the static getInstance method
    // since OutfitService has a private constructor
    try {
      // Use the static getInstance method instead of trying to create a new instance
      return RealOutfitService.getInstance();
    } catch (error) {
      console.error("Error getting OutfitService instance:", error);
      // Fallback to a minimal implementation
      return {
        generateOutfit: async (prompt: string) => {
          throw new Error('Real implementation required');
        },
        saveOutfit: async (outfit: any) => {
          throw new Error('Real implementation required');
        },
        getUserOutfits: async () => {
          throw new Error('Real implementation required');
        }
      };
    }
  }
};

// Export the service instances
export const WardrobeService = createWardrobeService();
export const OutfitService = createOutfitService();

// Helper function to simulate network delay for any async function
// Useful for adding consistent delays to service calls in design mode
export const withDelay = async <T>(
  fn: () => Promise<T>,
  minDelay: number = 300,
  maxDelay: number = 800
): Promise<T> => {
  const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  const [result] = await Promise.all([
    fn(),
    new Promise(resolve => setTimeout(resolve, delay))
  ]);
  return result;
};
