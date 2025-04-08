import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { WardrobeFilters, WardrobeItem, WardrobeService } from '@/services/wardrobe/types';
import { WardrobeService as WardrobeServiceImpl } from '@/services/wardrobe/wardrobe.service';

// Create a singleton instance of the wardrobe service
const wardrobeService = WardrobeServiceImpl.getInstance();

// Query keys for caching
export const wardrobeKeys = {
  all: ['wardrobe'] as const,
  items: () => [...wardrobeKeys.all, 'items'] as const,
  item: (id: string) => [...wardrobeKeys.items(), id] as const,
  filtered: (filters: WardrobeFilters) => [...wardrobeKeys.items(), filters] as const,
  stats: () => [...wardrobeKeys.all, 'stats'] as const,
};

// Hook for fetching all wardrobe items with optional filters
export function useWardrobeItems(filters?: WardrobeFilters) {
  return useQuery({
    queryKey: filters ? wardrobeKeys.filtered(filters) : wardrobeKeys.items(),
    queryFn: () => wardrobeService.getWardrobeItems(filters),
  });
}

// Hook for fetching a single wardrobe item by ID
export function useWardrobeItem(id: string) {
  return useQuery({
    queryKey: wardrobeKeys.item(id),
    queryFn: () => wardrobeService.getWardrobeItem(id),
    enabled: !!id, // Only run the query if an ID is provided
  });
}

// Hook for fetching wardrobe statistics
export function useWardrobeStats() {
  return useQuery({
    queryKey: wardrobeKeys.stats(),
    queryFn: () => wardrobeService.getWardrobeStats(),
  });
}

// Hook for adding a new wardrobe item
export function useAddWardrobeItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (item: Omit<WardrobeItem, 'id'>) => wardrobeService.addWardrobeItem(item),
    onSuccess: () => {
      // Invalidate the wardrobe items query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.items() });
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.stats() });
    },
  });
}

// Hook for updating a wardrobe item
export function useUpdateWardrobeItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<WardrobeItem> }) => 
      wardrobeService.updateWardrobeItem(id, updates),
    onSuccess: (updatedItem) => {
      // Update the item in the cache
      queryClient.setQueryData(wardrobeKeys.item(updatedItem.id), updatedItem);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.items() });
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.stats() });
    },
  });
}

// Hook for removing a wardrobe item
export function useRemoveWardrobeItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => wardrobeService.removeWardrobeItem(id),
    onSuccess: (_, id) => {
      // Remove the item from the cache
      queryClient.removeQueries({ queryKey: wardrobeKeys.item(id) });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.items() });
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.stats() });
    },
  });
}

// Hook for toggling favorite status of a wardrobe item
export function useToggleFavorite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => wardrobeService.toggleFavorite(id),
    onSuccess: (updatedItem) => {
      // Update the item in the cache
      queryClient.setQueryData(wardrobeKeys.item(updatedItem.id), updatedItem);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.items() });
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.stats() });
    },
  });
}

// Hook for incrementing wear count of a wardrobe item
export function useIncrementWearCount() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => wardrobeService.incrementWearCount(id),
    onSuccess: (updatedItem) => {
      // Update the item in the cache
      queryClient.setQueryData(wardrobeKeys.item(updatedItem.id), updatedItem);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.items() });
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.stats() });
    },
  });
}
