import { supabase } from '@/utils/supabase';
import { OutfitGenerationRequest, OutfitService as IOutfitService, GeneratedOutfit, OutfitItem } from './types';

export interface Outfit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  items: string[]; // Array of wardrobe item IDs
  imageUrl?: string;
  occasion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOutfitDTO {
  name: string;
  description?: string;
  items: string[];
  imageUrl?: string;
  occasion?: string;
}

export class OutfitService implements IOutfitService {
  private static instance: OutfitService;

  private constructor() {}

  public static getInstance(): OutfitService {
    if (!OutfitService.instance) {
      OutfitService.instance = new OutfitService();
    }
    return OutfitService.instance;
  }

  async getOutfits(userId: string): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      return data as Outfit[];
    } catch (error) {
      console.error('Error fetching outfits:', error);
      return [];
    }
  }

  async getOutfitById(id: string): Promise<Outfit | null> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data as Outfit;
    } catch (error) {
      console.error('Error fetching outfit:', error);
      return null;
    }
  }

  async createOutfit(userId: string, outfit: CreateOutfitDTO): Promise<Outfit | null> {
    try {
      const newOutfit = {
        userId,
        ...outfit,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('outfits')
        .insert([newOutfit])
        .select()
        .single();

      if (error) throw error;

      return data as Outfit;
    } catch (error) {
      console.error('Error creating outfit:', error);
      return null;
    }
  }

  async updateOutfit(id: string, outfit: Partial<CreateOutfitDTO>): Promise<Outfit | null> {
    try {
      const updateData = {
        ...outfit,
        updatedAt: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('outfits')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data as Outfit;
    } catch (error) {
      console.error('Error updating outfit:', error);
      return null;
    }
  }

  async deleteOutfit(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('outfits')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting outfit:', error);
      return false;
    }
  }

  async generateOutfit(request: OutfitGenerationRequest): Promise<GeneratedOutfit> {
    try {
      // This would typically call an AI service like OpenAI
      // For now, we'll implement a simple mock that creates an outfit from existing wardrobe items
      
      // Get user's wardrobe items
      const { data: wardrobeItems, error: wardrobeError } = await supabase
        .from('wardrobe_items')
        .select('*');

      if (wardrobeError) throw wardrobeError;

      if (!wardrobeItems || wardrobeItems.length === 0) {
        throw new Error('No wardrobe items found to create an outfit');
      }

      // Simple logic to select items for an outfit
      // In a real implementation, this would use AI to select appropriate items
      const tops = wardrobeItems.filter((item: any) => item.type === 'top');
      const bottoms = wardrobeItems.filter((item: any) => item.type === 'bottom');
      const shoes = wardrobeItems.filter((item: any) => item.type === 'shoes');
      const accessories = wardrobeItems.filter((item: any) => item.type === 'accessory');
      
      const selectedTop = tops.length > 0 ? tops[Math.floor(Math.random() * tops.length)] : null;
      const selectedBottom = bottoms.length > 0 ? bottoms[Math.floor(Math.random() * bottoms.length)] : null;
      const selectedShoes = shoes.length > 0 ? shoes[Math.floor(Math.random() * shoes.length)] : null;
      const selectedAccessory = accessories.length > 0 ? accessories[Math.floor(Math.random() * accessories.length)] : null;
      
      const outfitItems: OutfitItem[] = [
        selectedTop,
        selectedBottom,
        selectedShoes,
        selectedAccessory
      ].filter(Boolean) as OutfitItem[];
      
      if (outfitItems.length === 0) {
        throw new Error('Could not create a valid outfit');
      }
      
      // Create the outfit
      const generatedOutfit: GeneratedOutfit = {
        id: `outfit-${Date.now()}`,
        name: request.preferences?.occasion || 'New Outfit',
        items: outfitItems,
        description: `Outfit generated for ${request.preferences?.occasion || 'any occasion'}`,
        createdAt: new Date().toISOString(),
        prompt: request.prompt
      };
      
      return generatedOutfit;
    } catch (error) {
      console.error('Error generating outfit:', error);
      throw new Error('Failed to generate outfit');
    }
  }

  async saveOutfit(outfit: GeneratedOutfit): Promise<void> {
    try {
      // First, we need to save the outfit metadata
      const outfitData = {
        id: outfit.id,
        name: outfit.name,
        description: outfit.description,
        createdAt: outfit.createdAt,
        prompt: outfit.prompt,
        // Store item IDs as an array
        itemIds: outfit.items.map(item => item.id)
      };

      const { error } = await supabase
        .from('outfits')
        .insert([outfitData]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving outfit:', error);
      throw new Error('Failed to save outfit');
    }
  }

  async getUserOutfits(): Promise<GeneratedOutfit[]> {
    try {
      // Get all outfits
      const { data: outfits, error: outfitsError } = await supabase
        .from('outfits')
        .select('*')
        .order('createdAt', { ascending: false });

      if (outfitsError) throw outfitsError;

      if (!outfits || outfits.length === 0) {
        return [];
      }

      // For each outfit, get the associated items
      const generatedOutfits: GeneratedOutfit[] = [];

      for (const outfit of outfits) {
        // Get the items for this outfit
        const { data: items, error: itemsError } = await supabase
          .from('wardrobe_items')
          .select('*')
          .in('id', outfit.itemIds);

        if (itemsError) throw itemsError;

        generatedOutfits.push({
          id: outfit.id,
          name: outfit.name,
          description: outfit.description,
          createdAt: outfit.createdAt,
          prompt: outfit.prompt,
          items: items as OutfitItem[]
        });
      }

      return generatedOutfits;
    } catch (error) {
      console.error('Error fetching user outfits:', error);
      return [];
    }
  }
}
