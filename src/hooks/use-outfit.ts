import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GeneratedOutfit, OutfitGenerationRequest, OutfitService } from '@/services/outfit/types';
import { OutfitService as OutfitServiceImpl } from '@/services/outfit/outfit.service';

// Create a singleton instance of the outfit service
const outfitService = OutfitServiceImpl.getInstance();

// Query keys for caching
export const outfitKeys = {
  all: ['outfits'] as const,
  list: () => [...outfitKeys.all, 'list'] as const,
  outfit: (id: string) => [...outfitKeys.all, 'outfit', id] as const,
};

// Hook for fetching all user outfits
export function useUserOutfits() {
  return useQuery({
    queryKey: outfitKeys.list(),
    queryFn: () => outfitService.getUserOutfits(),
  });
}

// Hook for generating a new outfit
export function useGenerateOutfit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: OutfitGenerationRequest) => outfitService.generateOutfit(request),
    onSuccess: (generatedOutfit) => {
      // We don't invalidate queries here because the generated outfit isn't automatically saved
      // It's just returned to the user for review
    },
  });
}

// Hook for saving an outfit
export function useSaveOutfit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (outfit: GeneratedOutfit) => outfitService.saveOutfit(outfit),
    onSuccess: () => {
      // Invalidate the outfits list query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: outfitKeys.list() });
    },
  });
}
