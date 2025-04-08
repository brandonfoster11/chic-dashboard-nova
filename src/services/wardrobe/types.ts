import { OutfitItem } from "@/services/outfit/types";

export interface WardrobeItem extends OutfitItem {
  dateAdded: string;
  favorite: boolean;
  tags: string[];
  wearCount: number;
  lastWorn?: string;
}

export interface WardrobeCategory {
  id: string;
  name: string;
  count: number;
}

export interface WardrobeStats {
  totalItems: number;
  categories: WardrobeCategory[];
  mostWorn: WardrobeItem | null;
  recentlyAdded: WardrobeItem[];
  favorites: WardrobeItem[];
}

export interface WardrobeFilters {
  type?: string[];
  color?: string[];
  brand?: string[];
  tags?: string[];
  favorite?: boolean;
  search?: string;
}

export interface WardrobeService {
  getWardrobeItems(filters?: WardrobeFilters): Promise<WardrobeItem[]>;
  getWardrobeItem(id: string): Promise<WardrobeItem>;
  addWardrobeItem(item: Omit<WardrobeItem, 'id'>): Promise<WardrobeItem>;
  updateWardrobeItem(id: string, updates: Partial<WardrobeItem>): Promise<WardrobeItem>;
  removeWardrobeItem(id: string): Promise<void>;
  getWardrobeStats(): Promise<WardrobeStats>;
  toggleFavorite(id: string): Promise<WardrobeItem>;
  incrementWearCount(id: string): Promise<WardrobeItem>;
}
