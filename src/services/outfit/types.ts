export interface OutfitItem {
  id: string;
  name: string;
  type: 'top' | 'bottom' | 'shoes' | 'accessory';
  imageUrl: string;
  color: string;
  brand?: string;
  description?: string;
}

export interface GeneratedOutfit {
  id: string;
  name: string;
  items: OutfitItem[];
  description: string;
  createdAt: string;
  prompt: string;
}

export interface OutfitGenerationRequest {
  prompt: string;
  userImages?: File[];
  preferences?: {
    style?: string;
    season?: string;
    occasion?: string;
    colors?: string[];
  };
}

export interface OutfitService {
  generateOutfit(request: OutfitGenerationRequest): Promise<GeneratedOutfit>;
  saveOutfit(outfit: GeneratedOutfit): Promise<void>;
  getUserOutfits(): Promise<GeneratedOutfit[]>;
}
