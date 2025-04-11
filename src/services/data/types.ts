/**
 * Core data types for StyleAI application
 * These types are used across the application and are database-agnostic
 */

// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role_id: number;
  created_at: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
}

// Wardrobe related types
export interface WardrobeItem {
  id: string;
  user_id: string;
  name: string;
  type: ItemType;
  color: string;
  image_url: string;
  tags: string[];
  season?: Season;
  created_at: string;
  updated_at: string;
}

export type ItemType = 'top' | 'bottom' | 'outerwear' | 'footwear' | 'accessory';
export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'all';

// Outfit related types
export interface Outfit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  occasion?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface OutfitItem {
  id: string;
  outfit_id: string;
  wardrobe_item_id: string;
  position: number;
}

// Style preferences
export interface StylePreference {
  id: string;
  user_id: string;
  style_type: string;
  value: number; // 1-10 rating
  created_at: string;
  updated_at: string;
}

// Data provider interface
export interface DataProvider {
  // User management
  getUser: () => Promise<User | null>;
  updateUser: (userData: Partial<User>) => Promise<User>;
  
  // Wardrobe management
  getWardrobeItems: () => Promise<WardrobeItem[]>;
  getWardrobeItem: (id: string) => Promise<WardrobeItem | null>;
  createWardrobeItem: (item: Omit<WardrobeItem, 'id' | 'created_at' | 'updated_at'>) => Promise<WardrobeItem>;
  updateWardrobeItem: (id: string, data: Partial<WardrobeItem>) => Promise<WardrobeItem>;
  deleteWardrobeItem: (id: string) => Promise<boolean>;
  
  // Outfit management
  getOutfits: () => Promise<Outfit[]>;
  getOutfit: (id: string) => Promise<Outfit | null>;
  createOutfit: (outfit: Omit<Outfit, 'id' | 'created_at' | 'updated_at'>) => Promise<Outfit>;
  updateOutfit: (id: string, data: Partial<Outfit>) => Promise<Outfit>;
  deleteOutfit: (id: string) => Promise<boolean>;
  
  // Outfit items
  getOutfitItems: (outfitId: string) => Promise<OutfitItem[]>;
  addItemToOutfit: (outfitId: string, wardrobeItemId: string, position: number) => Promise<OutfitItem>;
  removeItemFromOutfit: (outfitItemId: string) => Promise<boolean>;
  
  // Style preferences
  getStylePreferences: () => Promise<StylePreference[]>;
  updateStylePreference: (id: string, value: number) => Promise<StylePreference>;
  
  // AI outfit generation
  generateOutfit: (prompt: string) => Promise<Outfit>;
}
