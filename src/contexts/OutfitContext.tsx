import { createContext, useContext, useState, ReactNode } from 'react';
import { 
  GeneratedOutfit, 
  OutfitGenerationRequest, 
  OutfitService 
} from '@/services/outfit/types';
import { OutfitService as OutfitServiceImpl } from '@/services/outfit/outfit.service';

interface OutfitContextType {
  generatedOutfit: GeneratedOutfit | null;
  isGenerating: boolean;
  error: string | null;
  userImages: File[];
  generateOutfit: (prompt: string) => Promise<GeneratedOutfit>;
  saveOutfit: (outfit: GeneratedOutfit) => Promise<void>;
  getUserOutfits: () => Promise<GeneratedOutfit[]>;
  addUserImage: (file: File) => void;
  removeUserImage: (index: number) => void;
  clearUserImages: () => void;
}

const OutfitContext = createContext<OutfitContextType | undefined>(undefined);

const outfitService: OutfitService = OutfitServiceImpl.getInstance();

export function OutfitProvider({ children }: { children: ReactNode }) {
  const [generatedOutfit, setGeneratedOutfit] = useState<GeneratedOutfit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userImages, setUserImages] = useState<File[]>([]);

  const generateOutfit = async (prompt: string): Promise<GeneratedOutfit> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const request: OutfitGenerationRequest = {
        prompt,
        userImages: userImages.length > 0 ? userImages : undefined
      };
      
      const outfit = await outfitService.generateOutfit(request);
      setGeneratedOutfit(outfit);
      return outfit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate outfit';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveOutfit = async (outfit: GeneratedOutfit): Promise<void> => {
    try {
      await outfitService.saveOutfit(outfit);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save outfit';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getUserOutfits = async (): Promise<GeneratedOutfit[]> => {
    try {
      return await outfitService.getUserOutfits();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get outfits';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const addUserImage = (file: File) => {
    setUserImages(prev => [...prev, file]);
  };

  const removeUserImage = (index: number) => {
    setUserImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearUserImages = () => {
    setUserImages([]);
  };

  return (
    <OutfitContext.Provider
      value={{
        generatedOutfit,
        isGenerating,
        error,
        userImages,
        generateOutfit,
        saveOutfit,
        getUserOutfits,
        addUserImage,
        removeUserImage,
        clearUserImages
      }}
    >
      {children}
    </OutfitContext.Provider>
  );
}

export function useOutfit() {
  const context = useContext(OutfitContext);
  if (context === undefined) {
    throw new Error('useOutfit must be used within an OutfitProvider');
  }
  return context;
}
