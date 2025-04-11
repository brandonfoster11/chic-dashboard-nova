import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { WardrobeFilters, WardrobeItem } from '@/services/wardrobe/types';
import { WardrobeService } from '@/services/service-factory';

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
  return useQuery<WardrobeItem[]>({
    queryKey: filters ? wardrobeKeys.filtered(filters) : wardrobeKeys.items(),
    queryFn: () => WardrobeService.getWardrobeItems(filters),
  });
}

// Hook for fetching a single wardrobe item by ID
export function useWardrobeItem(id: string) {
  return useQuery<WardrobeItem>({
    queryKey: wardrobeKeys.item(id),
    queryFn: () => WardrobeService.getWardrobeItem(id),
    enabled: !!id,
  });
}

// Hook for fetching wardrobe statistics
export function useWardrobeStats() {
  return useQuery({
    queryKey: wardrobeKeys.stats(),
    queryFn: () => WardrobeService.getWardrobeStats(),
  });
}

// Hook for adding a new wardrobe item
export function useAddWardrobeItem() {
  const queryClient = useQueryClient();
  
  return useMutation<WardrobeItem, Error, Omit<WardrobeItem, 'id'>>({
    mutationFn: (item: Omit<WardrobeItem, 'id'>) => WardrobeService.addWardrobeItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.items() });
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.stats() });
    },
  });
}

// Hook for updating a wardrobe item
export function useUpdateWardrobeItem() {
  const queryClient = useQueryClient();
  
  return useMutation<WardrobeItem, Error, { id: string, updates: Partial<WardrobeItem> }>({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<WardrobeItem> }) => 
      WardrobeService.updateWardrobeItem(id, updates),
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.items() });
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.item(updatedItem.id) });
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.stats() });
    },
  });
}

// Hook for removing a wardrobe item
export function useRemoveWardrobeItem() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => WardrobeService.removeWardrobeItem(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.items() });
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.item(id) });
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.stats() });
    },
  });
}

// Hook for toggling favorite status of a wardrobe item
export function useToggleFavorite() {
  const queryClient = useQueryClient();
  
  return useMutation<WardrobeItem, Error, string>({
    mutationFn: (id: string) => WardrobeService.toggleFavorite(id),
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.items() });
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.item(updatedItem.id) });
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.stats() });
    },
  });
}

// Hook for incrementing wear count of a wardrobe item
export function useIncrementWearCount() {
  const queryClient = useQueryClient();
  
  return useMutation<WardrobeItem, Error, string>({
    mutationFn: (id: string) => WardrobeService.incrementWearCount(id),
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.items() });
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.item(updatedItem.id) });
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.stats() });
    },
  });
}
