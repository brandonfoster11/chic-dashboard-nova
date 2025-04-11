import { OutfitGenerationRequest, OutfitService as IOutfitService, GeneratedOutfit, OutfitItem } from './types';
import { toast } from '@/components/ui/use-toast';
import { mockOutfits, getOutfits, getOutfit, createOutfit, updateOutfit, deleteOutfit, generateOutfit, getOutfitItems, addItemToOutfit, removeItemFromOutfit } from './outfit.service.mock';

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

// Helper function to convert between data formats
const convertOutfit = (outfit: any): Outfit => {
  return {
    id: outfit.id,
    userId: outfit.user_id,
    name: outfit.name,
    description: outfit.description,
    items: outfit.items || [],
    imageUrl: outfit.image_url,
    occasion: outfit.occasion,
    createdAt: outfit.created_at,
    updatedAt: outfit.updated_at
  };
};

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
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const outfits = await getOutfits();
      return outfits.map(convertOutfit);
    } catch (error) {
      console.error('Error fetching outfits:', error);
      return [];
    }
  }

  async getOutfitById(id: string): Promise<Outfit | null> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const outfit = await getOutfit(id);
      return outfit ? convertOutfit(outfit) : null;
    } catch (error) {
      console.error('Error fetching outfit:', error);
      return null;
    }
  }

  async createOutfit(userId: string, outfitData: CreateOutfitDTO): Promise<Outfit | null> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newOutfit = await createOutfit({
        user_id: userId,
        name: outfitData.name,
        description: outfitData.description,
        image_url: outfitData.imageUrl,
        occasion: outfitData.occasion,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      toast({
        title: "Outfit Created",
        description: `${outfitData.name} has been created.`
      });
      
      return convertOutfit(newOutfit);
    } catch (error) {
      console.error('Error creating outfit:', error);
      toast({
        title: "Error",
        description: `Failed to create outfit: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
      return null;
    }
  }

  async updateOutfit(id: string, outfitData: Partial<CreateOutfitDTO>): Promise<Outfit | null> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const updatedOutfit = await updateOutfit(id, {
        name: outfitData.name,
        description: outfitData.description,
        image_url: outfitData.imageUrl,
        occasion: outfitData.occasion,
        updated_at: new Date().toISOString()
      });
      
      toast({
        title: "Outfit Updated",
        description: `${updatedOutfit.name} has been updated.`
      });
      
      return convertOutfit(updatedOutfit);
    } catch (error) {
      console.error('Error updating outfit:', error);
      toast({
        title: "Error",
        description: `Failed to update outfit: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
      return null;
    }
  }

  async deleteOutfit(id: string): Promise<boolean> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = await deleteOutfit(id);
      
      if (result) {
        toast({
          title: "Outfit Deleted",
          description: "The outfit has been removed."
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error deleting outfit:', error);
      toast({
        title: "Error",
        description: `Failed to delete outfit: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
      return false;
    }
  }

  async generateOutfit(request: OutfitGenerationRequest): Promise<GeneratedOutfit> {
    try {
      // Simulate network delay for AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Generating Outfit",
        description: "Creating your outfit based on the prompt..."
      });
      
      const generatedOutfit = await generateOutfit(request.prompt);
      
      // Get outfit items
      const items = await getOutfitItems(generatedOutfit.id);
      
      toast({
        title: "Outfit Generated",
        description: "Your new outfit is ready!"
      });
      
      return {
        id: generatedOutfit.id,
        name: generatedOutfit.name,
        description: generatedOutfit.description || '',
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type as 'top' | 'bottom' | 'shoes' | 'accessory' | 'outerwear' | 'footwear',
          imageUrl: item.image_url,
          color: item.color,
          brand: item.brand,
          description: item.description
        })),
        createdAt: generatedOutfit.created_at,
        prompt: request.prompt
      };
    } catch (error) {
      console.error('Error generating outfit:', error);
      toast({
        title: "Error",
        description: `Failed to generate outfit: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
      throw error;
    }
  }

  async saveOutfit(outfit: GeneratedOutfit): Promise<void> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      await createOutfit({
        user_id: 'mock-user-id',
        name: outfit.name,
        description: outfit.description,
        image_url: outfit.items[0]?.imageUrl || '',
        occasion: 'custom',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      toast({
        title: "Outfit Saved",
        description: `${outfit.name} has been saved to your collection.`
      });
    } catch (error) {
      console.error('Error saving outfit:', error);
      toast({
        title: "Error",
        description: `Failed to save outfit: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
      throw error;
    }
  }

  async getUserOutfits(): Promise<GeneratedOutfit[]> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const outfits = await getOutfits();
      
      const generatedOutfits: GeneratedOutfit[] = [];
      
      for (const outfit of outfits) {
        const items = await getOutfitItems(outfit.id);
        
        generatedOutfits.push({
          id: outfit.id,
          name: outfit.name,
          description: outfit.description || '',
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            type: item.type as 'top' | 'bottom' | 'shoes' | 'accessory' | 'outerwear' | 'footwear',
            imageUrl: item.image_url,
            color: item.color,
            brand: item.brand,
            description: item.description
          })),
          createdAt: outfit.created_at,
          prompt: outfit.description || 'Custom outfit'
        });
      }
      
      return generatedOutfits;
    } catch (error) {
      console.error('Error fetching user outfits:', error);
      return [];
    }
  }
}
