import { 
  DataProvider, 
  User, 
  WardrobeItem, 
  Outfit, 
  OutfitItem, 
  StylePreference 
} from './types';

// Import mock data
import mockUserData from '../../mock/user.json';
import mockWardrobeData from '../../mock/wardrobe.json';
import mockOutfitsData from '../../mock/outfits.json';
import mockOutfitItemsData from '../../mock/outfit-items.json';
import mockStylePreferencesData from '../../mock/style-preferences.json';

// Helper to simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate unique IDs
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// Helper to get current timestamp
const timestamp = () => new Date().toISOString();

/**
 * Mock implementation of the DataProvider interface
 * This provides a complete in-memory implementation for development
 */
export class MockDataProvider implements DataProvider {
  private user: User = mockUserData as User;
  private wardrobeItems: WardrobeItem[] = mockWardrobeData as WardrobeItem[];
  private outfits: Outfit[] = mockOutfitsData as Outfit[];
  private outfitItems: OutfitItem[] = mockOutfitItemsData as OutfitItem[];
  private stylePreferences: StylePreference[] = mockStylePreferencesData as StylePreference[];

  // User management
  async getUser(): Promise<User | null> {
    await delay();
    return this.user;
  }

  async updateUser(userData: Partial<User>): Promise<User> {
    await delay();
    this.user = { ...this.user, ...userData };
    return this.user;
  }

  // Wardrobe management
  async getWardrobeItems(): Promise<WardrobeItem[]> {
    await delay();
    return this.wardrobeItems;
  }

  async getWardrobeItem(id: string): Promise<WardrobeItem | null> {
    await delay();
    const item = this.wardrobeItems.find(item => item.id === id);
    return item || null;
  }

  async createWardrobeItem(item: Omit<WardrobeItem, 'id' | 'created_at' | 'updated_at'>): Promise<WardrobeItem> {
    await delay();
    const newItem: WardrobeItem = {
      ...item,
      id: generateId('item'),
      created_at: timestamp(),
      updated_at: timestamp()
    };
    this.wardrobeItems.push(newItem);
    return newItem;
  }

  async updateWardrobeItem(id: string, data: Partial<WardrobeItem>): Promise<WardrobeItem> {
    await delay();
    const index = this.wardrobeItems.findIndex(item => item.id === id);
    if (index === -1) throw new Error(`Wardrobe item with ID ${id} not found`);
    
    const updatedItem = {
      ...this.wardrobeItems[index],
      ...data,
      updated_at: timestamp()
    };
    this.wardrobeItems[index] = updatedItem;
    return updatedItem;
  }

  async deleteWardrobeItem(id: string): Promise<boolean> {
    await delay();
    const initialLength = this.wardrobeItems.length;
    this.wardrobeItems = this.wardrobeItems.filter(item => item.id !== id);
    
    // Also delete any outfit items that reference this wardrobe item
    this.outfitItems = this.outfitItems.filter(item => item.wardrobe_item_id !== id);
    
    return this.wardrobeItems.length < initialLength;
  }

  // Outfit management
  async getOutfits(): Promise<Outfit[]> {
    await delay();
    return this.outfits;
  }

  async getOutfit(id: string): Promise<Outfit | null> {
    await delay();
    const outfit = this.outfits.find(outfit => outfit.id === id);
    return outfit || null;
  }

  async createOutfit(outfit: Omit<Outfit, 'id' | 'created_at' | 'updated_at'>): Promise<Outfit> {
    await delay();
    const newOutfit: Outfit = {
      ...outfit,
      id: generateId('outfit'),
      created_at: timestamp(),
      updated_at: timestamp()
    };
    this.outfits.push(newOutfit);
    return newOutfit;
  }

  async updateOutfit(id: string, data: Partial<Outfit>): Promise<Outfit> {
    await delay();
    const index = this.outfits.findIndex(outfit => outfit.id === id);
    if (index === -1) throw new Error(`Outfit with ID ${id} not found`);
    
    const updatedOutfit = {
      ...this.outfits[index],
      ...data,
      updated_at: timestamp()
    };
    this.outfits[index] = updatedOutfit;
    return updatedOutfit;
  }

  async deleteOutfit(id: string): Promise<boolean> {
    await delay();
    const initialLength = this.outfits.length;
    this.outfits = this.outfits.filter(outfit => outfit.id !== id);
    
    // Also delete any outfit items that reference this outfit
    this.outfitItems = this.outfitItems.filter(item => item.outfit_id !== id);
    
    return this.outfits.length < initialLength;
  }

  // Outfit items
  async getOutfitItems(outfitId: string): Promise<OutfitItem[]> {
    await delay();
    return this.outfitItems.filter(item => item.outfit_id === outfitId);
  }

  async addItemToOutfit(outfitId: string, wardrobeItemId: string, position: number): Promise<OutfitItem> {
    await delay();
    // Validate that the outfit and wardrobe item exist
    const outfit = await this.getOutfit(outfitId);
    const wardrobeItem = await this.getWardrobeItem(wardrobeItemId);
    
    if (!outfit) throw new Error(`Outfit with ID ${outfitId} not found`);
    if (!wardrobeItem) throw new Error(`Wardrobe item with ID ${wardrobeItemId} not found`);
    
    const newOutfitItem: OutfitItem = {
      id: generateId('outfit-item'),
      outfit_id: outfitId,
      wardrobe_item_id: wardrobeItemId,
      position
    };
    
    this.outfitItems.push(newOutfitItem);
    return newOutfitItem;
  }

  async removeItemFromOutfit(outfitItemId: string): Promise<boolean> {
    await delay();
    const initialLength = this.outfitItems.length;
    this.outfitItems = this.outfitItems.filter(item => item.id !== outfitItemId);
    return this.outfitItems.length < initialLength;
  }

  // Style preferences
  async getStylePreferences(): Promise<StylePreference[]> {
    await delay();
    return this.stylePreferences;
  }

  async updateStylePreference(id: string, value: number): Promise<StylePreference> {
    await delay();
    const index = this.stylePreferences.findIndex(pref => pref.id === id);
    if (index === -1) throw new Error(`Style preference with ID ${id} not found`);
    
    const updatedPreference = {
      ...this.stylePreferences[index],
      value,
      updated_at: timestamp()
    };
    this.stylePreferences[index] = updatedPreference;
    return updatedPreference;
  }

  // AI outfit generation (mock implementation)
  async generateOutfit(prompt: string): Promise<Outfit> {
    // Simulate a longer delay for AI processing
    await delay(1500);
    
    // Create a new outfit based on the prompt
    const newOutfit: Outfit = {
      id: generateId('outfit'),
      user_id: this.user.id,
      name: `Generated: ${prompt.slice(0, 20)}${prompt.length > 20 ? '...' : ''}`,
      description: `AI generated outfit based on prompt: ${prompt}`,
      occasion: prompt.toLowerCase().includes('casual') ? 'casual' : 
                prompt.toLowerCase().includes('formal') ? 'formal' : 
                prompt.toLowerCase().includes('work') ? 'work' : 'general',
      image_url: '/mock/outfits/generated.png',
      created_at: timestamp(),
      updated_at: timestamp()
    };
    
    this.outfits.push(newOutfit);
    
    // Randomly select items from wardrobe to add to this outfit
    const tops = this.wardrobeItems.filter(item => item.type === 'top');
    const bottoms = this.wardrobeItems.filter(item => item.type === 'bottom');
    const footwear = this.wardrobeItems.filter(item => item.type === 'footwear');
    
    if (tops.length > 0) {
      const randomTop = tops[Math.floor(Math.random() * tops.length)];
      this.outfitItems.push({
        id: generateId('outfit-item'),
        outfit_id: newOutfit.id,
        wardrobe_item_id: randomTop.id,
        position: 1
      });
    }
    
    if (bottoms.length > 0) {
      const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
      this.outfitItems.push({
        id: generateId('outfit-item'),
        outfit_id: newOutfit.id,
        wardrobe_item_id: randomBottom.id,
        position: 2
      });
    }
    
    if (footwear.length > 0) {
      const randomFootwear = footwear[Math.floor(Math.random() * footwear.length)];
      this.outfitItems.push({
        id: generateId('outfit-item'),
        outfit_id: newOutfit.id,
        wardrobe_item_id: randomFootwear.id,
        position: 3
      });
    }
    
    return newOutfit;
  }
}
