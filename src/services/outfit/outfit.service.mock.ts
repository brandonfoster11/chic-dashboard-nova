import { Outfit, OutfitItem } from '@/services/data/types';
import { USE_MOCKS } from '@/constants';
import { toast } from '@/components/ui/use-toast';

// Mock outfit data
export const mockOutfits: Outfit[] = [
  {
    id: 'outfit-mock-1',
    user_id: 'mock-user-id',
    name: 'Summer Casual',
    description: 'Perfect for a casual summer day',
    occasion: 'casual',
    created_at: '2025-03-15T10:30:00.000Z',
    updated_at: '2025-03-15T10:30:00.000Z',
    image_url: '/images/outfits/summer-casual.jpg'
  },
  {
    id: 'outfit-mock-2',
    user_id: 'mock-user-id',
    name: 'Business Meeting',
    description: 'Professional attire for important meetings',
    occasion: 'business',
    created_at: '2025-03-10T14:20:00.000Z',
    updated_at: '2025-03-10T14:20:00.000Z',
    image_url: '/images/outfits/business-meeting.jpg'
  },
  {
    id: 'outfit-mock-3',
    user_id: 'mock-user-id',
    name: 'Evening Party',
    description: 'Stylish outfit for evening events',
    occasion: 'party',
    created_at: '2025-03-05T18:45:00.000Z',
    updated_at: '2025-03-05T18:45:00.000Z',
    image_url: '/images/outfits/evening-party.jpg'
  }
];

// Mock outfit items
export const mockOutfitItems: OutfitItem[] = [
  {
    id: 'outfit-item-mock-1',
    outfit_id: 'outfit-mock-1',
    wardrobe_item_id: 'wardrobe-item-mock-1',
    position: 1
  },
  {
    id: 'outfit-item-mock-2',
    outfit_id: 'outfit-mock-1',
    wardrobe_item_id: 'wardrobe-item-mock-2',
    position: 2
  },
  {
    id: 'outfit-item-mock-3',
    outfit_id: 'outfit-mock-2',
    wardrobe_item_id: 'wardrobe-item-mock-3',
    position: 1
  },
  {
    id: 'outfit-item-mock-4',
    outfit_id: 'outfit-mock-2',
    wardrobe_item_id: 'wardrobe-item-mock-4',
    position: 2
  }
];

// Helper to generate unique IDs
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

/**
 * Get all outfits
 */
export const getOutfits = async (): Promise<Outfit[]> => {
  if (USE_MOCKS) {
    console.log('Mock outfit service: Getting all outfits');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockOutfits;
  }
  throw new Error('Real implementation required');
};

/**
 * Get outfit by ID
 */
export const getOutfit = async (id: string): Promise<Outfit | null> => {
  if (USE_MOCKS) {
    console.log(`Mock outfit service: Getting outfit with ID ${id}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockOutfits.find(outfit => outfit.id === id) || null;
  }
  throw new Error('Real implementation required');
};

/**
 * Create a new outfit
 */
export const createOutfit = async (outfitData: Partial<Outfit>): Promise<Outfit> => {
  if (USE_MOCKS) {
    console.log('Mock outfit service: Creating new outfit', outfitData);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Show success toast
    toast({
      title: "Outfit created",
      description: "Your new outfit has been created successfully.",
    });
    
    const newOutfit: Outfit = {
      id: generateId('outfit'),
      user_id: outfitData.user_id || 'mock-user-id',
      name: outfitData.name || 'New Outfit',
      description: outfitData.description || '',
      occasion: outfitData.occasion || 'casual',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image_url: outfitData.image_url || '/images/outfits/default.jpg'
    };
    
    // Add to mock data (not persisted between page refreshes)
    mockOutfits.push(newOutfit);
    
    return newOutfit;
  }
  throw new Error('Real implementation required');
};

/**
 * Update an existing outfit
 */
export const updateOutfit = async (id: string, outfitData: Partial<Outfit>): Promise<Outfit> => {
  if (USE_MOCKS) {
    console.log(`Mock outfit service: Updating outfit with ID ${id}`, outfitData);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const outfitIndex = mockOutfits.findIndex(outfit => outfit.id === id);
    if (outfitIndex === -1) {
      throw new Error(`Outfit with ID ${id} not found`);
    }
    
    // Show success toast
    toast({
      title: "Outfit updated",
      description: "Your outfit has been updated successfully.",
    });
    
    const updatedOutfit = {
      ...mockOutfits[outfitIndex],
      ...outfitData,
      updated_at: new Date().toISOString()
    };
    
    mockOutfits[outfitIndex] = updatedOutfit;
    
    return updatedOutfit;
  }
  throw new Error('Real implementation required');
};

/**
 * Delete an outfit
 */
export const deleteOutfit = async (id: string): Promise<boolean> => {
  if (USE_MOCKS) {
    console.log(`Mock outfit service: Deleting outfit with ID ${id}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const initialLength = mockOutfits.length;
    const outfitIndex = mockOutfits.findIndex(outfit => outfit.id === id);
    
    if (outfitIndex === -1) {
      return false;
    }
    
    // Show success toast
    toast({
      title: "Outfit deleted",
      description: "Your outfit has been deleted successfully.",
    });
    
    mockOutfits.splice(outfitIndex, 1);
    
    return mockOutfits.length < initialLength;
  }
  throw new Error('Real implementation required');
};

/**
 * Generate an outfit using AI
 */
export const generateOutfit = async (prompt: string): Promise<Outfit> => {
  if (USE_MOCKS) {
    console.log('Mock outfit service: Generating outfit with AI', { prompt });
    // Simulate longer network delay for AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show success toast
    toast({
      title: "Outfit generated",
      description: "Your AI-generated outfit is ready!",
    });
    
    const newOutfit: Outfit = {
      id: generateId('outfit'),
      user_id: 'mock-user-id',
      name: `AI Outfit: ${prompt.slice(0, 20)}${prompt.length > 20 ? '...' : ''}`,
      description: `Generated based on prompt: ${prompt}`,
      occasion: 'casual',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image_url: '/images/outfits/ai-generated.jpg'
    };
    
    // Add to mock data
    mockOutfits.push(newOutfit);
    
    return newOutfit;
  }
  throw new Error('Real implementation required');
};

/**
 * Toggle outfit favorite status
 * Note: In this mock implementation, we don't actually track favorites
 * since the Outfit type doesn't have an is_favorite property
 */
export const toggleFavorite = async (id: string): Promise<Outfit> => {
  if (USE_MOCKS) {
    console.log(`Mock outfit service: Toggling favorite status for outfit with ID ${id}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const outfitIndex = mockOutfits.findIndex(outfit => outfit.id === id);
    if (outfitIndex === -1) {
      throw new Error(`Outfit with ID ${id} not found`);
    }
    
    const updatedOutfit = {
      ...mockOutfits[outfitIndex],
      updated_at: new Date().toISOString()
    };
    
    mockOutfits[outfitIndex] = updatedOutfit;
    
    // Show success toast
    toast({
      title: "Favorite status updated",
      description: "The outfit's favorite status has been updated.",
    });
    
    return updatedOutfit;
  }
  throw new Error('Real implementation required');
};

/**
 * Get outfit items for a specific outfit
 */
export const getOutfitItems = async (outfitId: string): Promise<OutfitItem[]> => {
  if (USE_MOCKS) {
    console.log(`Mock outfit service: Getting items for outfit with ID ${outfitId}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockOutfitItems.filter(item => item.outfit_id === outfitId);
  }
  throw new Error('Real implementation required');
};

/**
 * Add an item to an outfit
 */
export const addItemToOutfit = async (outfitId: string, wardrobeItemId: string, position: number): Promise<OutfitItem> => {
  if (USE_MOCKS) {
    console.log(`Mock outfit service: Adding item to outfit`, { outfitId, wardrobeItemId, position });
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Show success toast
    toast({
      title: "Item added to outfit",
      description: "The item has been added to your outfit.",
    });
    
    const newOutfitItem: OutfitItem = {
      id: generateId('outfit-item'),
      outfit_id: outfitId,
      wardrobe_item_id: wardrobeItemId,
      position
    };
    
    // Add to mock data
    mockOutfitItems.push(newOutfitItem);
    
    return newOutfitItem;
  }
  throw new Error('Real implementation required');
};

/**
 * Remove an item from an outfit
 */
export const removeItemFromOutfit = async (outfitItemId: string): Promise<boolean> => {
  if (USE_MOCKS) {
    console.log(`Mock outfit service: Removing item with ID ${outfitItemId} from outfit`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const initialLength = mockOutfitItems.length;
    const itemIndex = mockOutfitItems.findIndex(item => item.id === outfitItemId);
    
    if (itemIndex === -1) {
      return false;
    }
    
    // Show success toast
    toast({
      title: "Item removed",
      description: "The item has been removed from your outfit.",
    });
    
    mockOutfitItems.splice(itemIndex, 1);
    
    return mockOutfitItems.length < initialLength;
  }
  throw new Error('Real implementation required');
};
