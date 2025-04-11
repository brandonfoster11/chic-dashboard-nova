import { WardrobeItem, ItemType, Season } from '@/services/data/types';
import { USE_MOCKS } from '@/constants';
import { toast } from '@/components/ui/use-toast';

// Mock wardrobe data
export const mockWardrobeItems: WardrobeItem[] = [
  {
    id: 'wardrobe-item-mock-1',
    user_id: 'mock-user-id',
    name: 'Blue Denim Jeans',
    type: 'bottom',
    color: 'blue',
    season: 'all',
    image_url: '/images/wardrobe/blue-jeans.jpg',
    created_at: '2025-02-15T10:30:00.000Z',
    updated_at: '2025-02-15T10:30:00.000Z',
    tags: ['casual', 'everyday', 'denim']
  },
  {
    id: 'wardrobe-item-mock-2',
    user_id: 'mock-user-id',
    name: 'White Cotton T-Shirt',
    type: 'top',
    color: 'white',
    season: 'all',
    image_url: '/images/wardrobe/white-tshirt.jpg',
    created_at: '2025-02-10T14:20:00.000Z',
    updated_at: '2025-02-10T14:20:00.000Z',
    tags: ['casual', 'basic', 'everyday']
  },
  {
    id: 'wardrobe-item-mock-3',
    user_id: 'mock-user-id',
    name: 'Black Leather Jacket',
    type: 'outerwear',
    color: 'black',
    season: 'fall',
    image_url: '/images/wardrobe/leather-jacket.jpg',
    created_at: '2025-01-25T18:45:00.000Z',
    updated_at: '2025-01-25T18:45:00.000Z',
    tags: ['edgy', 'evening', 'statement']
  },
  {
    id: 'wardrobe-item-mock-4',
    user_id: 'mock-user-id',
    name: 'Navy Blue Blazer',
    type: 'outerwear',
    color: 'navy',
    season: 'all',
    image_url: '/images/wardrobe/navy-blazer.jpg',
    created_at: '2025-01-20T09:15:00.000Z',
    updated_at: '2025-01-20T09:15:00.000Z',
    tags: ['formal', 'business', 'professional']
  },
  {
    id: 'wardrobe-item-mock-5',
    user_id: 'mock-user-id',
    name: 'Brown Leather Boots',
    type: 'footwear',
    color: 'brown',
    season: 'fall',
    image_url: '/images/wardrobe/brown-boots.jpg',
    created_at: '2025-01-15T11:30:00.000Z',
    updated_at: '2025-01-15T11:30:00.000Z',
    tags: ['casual', 'rugged', 'versatile']
  }
];

// Helper to generate unique IDs
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

/**
 * Get all wardrobe items
 */
export const getWardrobeItems = async (): Promise<WardrobeItem[]> => {
  if (USE_MOCKS) {
    console.log('Mock wardrobe service: Getting all wardrobe items');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockWardrobeItems;
  }
  throw new Error('Real implementation required');
};

/**
 * Get wardrobe item by ID
 */
export const getWardrobeItem = async (id: string): Promise<WardrobeItem | null> => {
  if (USE_MOCKS) {
    console.log(`Mock wardrobe service: Getting wardrobe item with ID ${id}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockWardrobeItems.find(item => item.id === id) || null;
  }
  throw new Error('Real implementation required');
};

/**
 * Create a new wardrobe item
 */
export const createWardrobeItem = async (itemData: Partial<WardrobeItem>): Promise<WardrobeItem> => {
  if (USE_MOCKS) {
    console.log('Mock wardrobe service: Creating new wardrobe item', itemData);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Show success toast
    toast({
      title: "Item added",
      description: "Your new item has been added to your wardrobe.",
    });
    
    const newItem: WardrobeItem = {
      id: generateId('wardrobe-item'),
      user_id: 'mock-user-id',
      name: itemData.name || 'New Item',
      type: itemData.type || 'top',
      color: itemData.color || '',
      season: itemData.season || 'all',
      image_url: itemData.image_url || '/images/wardrobe/default.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: itemData.tags || []
    };
    
    // Add to mock data (not persisted between page refreshes)
    mockWardrobeItems.push(newItem);
    
    return newItem;
  }
  throw new Error('Real implementation required');
};

/**
 * Update an existing wardrobe item
 */
export const updateWardrobeItem = async (id: string, itemData: Partial<WardrobeItem>): Promise<WardrobeItem> => {
  if (USE_MOCKS) {
    console.log(`Mock wardrobe service: Updating wardrobe item with ID ${id}`, itemData);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const itemIndex = mockWardrobeItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new Error(`Wardrobe item with ID ${id} not found`);
    }
    
    // Show success toast
    toast({
      title: "Item updated",
      description: "Your wardrobe item has been updated successfully.",
    });
    
    const updatedItem = {
      ...mockWardrobeItems[itemIndex],
      ...itemData,
      updated_at: new Date().toISOString()
    };
    
    mockWardrobeItems[itemIndex] = updatedItem;
    
    return updatedItem;
  }
  throw new Error('Real implementation required');
};

/**
 * Delete a wardrobe item
 */
export const deleteWardrobeItem = async (id: string): Promise<boolean> => {
  if (USE_MOCKS) {
    console.log(`Mock wardrobe service: Deleting wardrobe item with ID ${id}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const initialLength = mockWardrobeItems.length;
    const itemIndex = mockWardrobeItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return false;
    }
    
    // Show success toast
    toast({
      title: "Item deleted",
      description: "Your wardrobe item has been deleted successfully.",
    });
    
    mockWardrobeItems.splice(itemIndex, 1);
    
    return mockWardrobeItems.length < initialLength;
  }
  throw new Error('Real implementation required');
};

/**
 * Upload an image for a wardrobe item
 * In mock mode, this just simulates the upload process
 */
export const uploadItemImage = async (file: File): Promise<string> => {
  if (USE_MOCKS) {
    console.log('Mock wardrobe service: Uploading image', { fileName: file.name, fileSize: file.size });
    // Simulate longer network delay for upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success toast
    toast({
      title: "Image uploaded",
      description: "Your image has been uploaded successfully.",
    });
    
    // Return a fake URL
    return `/images/wardrobe/mock-upload-${Date.now()}.jpg`;
  }
  throw new Error('Real implementation required');
};
